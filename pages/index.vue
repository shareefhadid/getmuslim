<template>
  <div>
    <UContainer class="pt-4 max-sm:px-0">
      <GMCategoryCarousel />
    </UContainer>

    <UContainer>
      <div class="mt-12 flex items-center gap-x-2">
        <p class="text-xs">Sort by:</p>
        <USelect
          class="w-32 focus-visible:ring-[var(--ui-border-accented)]"
          v-model="sortMode"
          :items="sortOptions"
          size="xs"
          variant="subtle"
          @update:modelValue="setSorting" />
      </div>
    </UContainer>

    <UContainer class="pt-6 pb-10">
      <div
        class="xs:grid-cols-2 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        <template v-for="posting in postings" :key="posting.id">
          <GMPostingCard :posting="posting" />
        </template>
      </div>
      <div class="flex flex-row justify-center pt-16">
        <UPagination
          :page="page"
          :items-per-page="1"
          show-controls
          :to="to"
          :total="pagination.totalPages"
          :ui="{ label: 'hover:cursor-pointer' }"
          size="sm"
          active-color="neutral" />
      </div>
    </UContainer>

    <UContainer class="hidden">
      <pre class="pt-10 text-xs">{{ postings }}</pre>
      <pre class="pt-10 text-xs">{{ pagination }}</pre>
    </UContainer>
  </div>
</template>

<script lang="ts" setup>
import { GMLocationModal } from "#components";

const route = useRoute();
const modal = useModal();

// Pagination
const page = computed(() => Number(route.query.page) || 1);

function to(pageNum: number) {
  return {
    query: {
      ...route.query,
      page: pageNum,
    },
  };
}

// Sorting
const sortMode = ref<PostingMode>(PostingMode.Recent);

function setSorting(payload: PostingMode) {
  if (payload === PostingMode.Nearby) {
    sortMode.value = PostingMode.Recent;
    modal.open(GMLocationModal);
  }
}

const sortOptions = [
  {
    label: "Newest",
    value: PostingMode.Recent,
    icon: "mdi:sparkles-outline",
  },
  {
    label: "Nearest",
    value: PostingMode.Nearby,
    icon: "mdi:map-marker-radius-outline",
  },
];

// Fetch postings
const params = computed<PostingsParams>(() => ({
  page: page.value,
  mode: sortMode.value,
  category: Number(route.query.category) || undefined,
}));

const { postings, pagination } = usePostings(params);
</script>
