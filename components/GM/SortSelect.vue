<template>
  <div class="flex items-center gap-x-2">
    <p class="text-xs">Sort by:</p>
    <USelect
      class="w-28 focus-visible:ring-[var(--ui-border-accented)]"
      v-model:model-value="selected"
      :items="sortOptions"
      size="xs"
      variant="subtle"
      @update:modelValue="handleSortChange" />
  </div>
</template>

<script lang="ts" setup>
import { GMLocationModal } from "#components";

const route = useRoute();
const router = useRouter();
const modal = useModal();
const locationCookie = useLocationCookie();
const emit = defineEmits<{
  "update:sortMode": [mode: PostingMode];
}>();

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

const selected = ref(
  route.query.sort === "nearby" && locationCookie.value.isSet
    ? PostingMode.Nearby
    : PostingMode.Recent,
);

if (route.query.sort === "nearby" && !locationCookie.value.isSet) {
  router.replace({ query: { ...route.query, sort: undefined } });
}

function handleSortChange(payload: PostingMode) {
  if (payload === PostingMode.Nearby && !locationCookie.value.isSet) {
    selected.value = PostingMode.Recent;
    router.replace({
      query: {
        ...route.query,
        sort: undefined,
        page: undefined,
      },
    });
    modal.open(GMLocationModal, {
      onLocationSet: () => {
        selected.value = PostingMode.Nearby;
        router.replace({
          query: {
            ...route.query,
            sort: "nearby",
            page: undefined,
          },
        });
        emit("update:sortMode", PostingMode.Nearby);
      },
    });
  } else {
    const newQuery = {
      ...route.query,
      sort: payload === PostingMode.Nearby ? "nearby" : undefined,
      page: undefined,
    };
    router.replace({ query: newQuery });
    emit("update:sortMode", payload);
  }
}
</script>
