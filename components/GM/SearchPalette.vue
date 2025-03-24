<template>
  <UModal
    :ui="{ header: 'sr-only', body: 'p-0 sm:p-0' }"
    title="Search postings"
    description="Enter a search term to find related postings and categories">
    <template #body>
      <UCommandPalette
        v-model:search-term="searchText"
        :loading="isLoading"
        :groups="groups"
        autofocus
        close
        @update:open="handleClose()"
        placeholder="Search businesses and categories..."
        :ui="{}">
        <template #empty>
          <div class="text-ui-muted">
            <p>
              <template v-if="searchText.length < 3">
                Type at least 3 characters to search...
              </template>
              <template v-else-if="isLoading || debouncing">
                Searching...
              </template>
              <template v-else>
                No results found for "{{ searchText }}"
              </template>
            </p>
          </div>
        </template>
      </UCommandPalette>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { CommandPaletteGroup, CommandPaletteItem } from "@nuxt/ui";

const emit = defineEmits(["close"]);
function handleClose() {
  emit("close");
}

const route = useRoute();
const router = useRouter();

const searchText = ref("");

const { categories, postings, isLoading, debouncing } = useSearch(searchText);

const handleCategorySelect = async (categoryId: number) => {
  await router.push({
    path: "/",
    query: {
      ...route.query,
      category: categoryId.toString(),
      page: undefined,
    },
  });
};

const scrollToResults = () => {
  const resultsElement = document.getElementById("results");

  if (resultsElement) {
    const y = resultsElement.getBoundingClientRect().top + window.scrollY - 50;

    window.scrollTo({ top: y, behavior: "smooth" });
  }
};

const groups = computed<CommandPaletteGroup<CommandPaletteItem>[]>(() => {
  const base = [
    {
      id: "reset",
      items: [
        {
          icon: "mdi:refresh",
          label: "View all postings",
          onSelect: () => {
            router.replace("/");
            handleClose();
            scrollToResults();
          },
        },
      ],
    },
  ];

  if (searchText.value.length < 3) {
    return base;
  }

  return [
    {
      id: "postings",
      label: "Businesses",
      items: postings.value.map((posting) => ({
        id: posting.id,
        label: posting.title,
        suffix: posting.description,
        onSelect: () => {
          navigateTo(`/postings/${posting.id}`);
          handleClose();
          searchText.value = "";
        },
      })),
    },
    {
      id: "categories",
      label: "Categories",
      items: categories.value.map((category) => ({
        id: category.id,
        label: category.label,
        icon: category.icon || "lucide:tags",
        onSelect: () => {
          handleCategorySelect(category.id);
          handleClose();
          searchText.value = "";
          scrollToResults();
        },
      })),
    },
  ];
});
</script>
