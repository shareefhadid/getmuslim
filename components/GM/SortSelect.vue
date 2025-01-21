<template>
  <div class="flex items-center gap-x-2">
    <p class="text-xs">Sort by:</p>
    <USelect
      class="w-28 focus-visible:ring-[var(--ui-border-accented)]"
      :model-value="selected"
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

const selected = computed(() =>
  route.query.sort === "nearby" && locationCookie.value.isSet
    ? PostingMode.Nearby
    : PostingMode.Recent,
);

function handleSortChange(payload: PostingMode) {
  if (payload === PostingMode.Nearby && !locationCookie.value.isSet) {
    modal.open(GMLocationModal, {
      onLocationSet: () => {
        router.replace({
          query: {
            ...route.query,
            sort: "nearby",
            page: undefined,
          },
        });
      },
    });
  } else {
    router.replace({
      query: {
        ...route.query,
        sort: payload === PostingMode.Nearby ? "nearby" : undefined,
        page: undefined,
      },
    });
  }
}
</script>
