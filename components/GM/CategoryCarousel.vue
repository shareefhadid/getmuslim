<template>
  <UCarousel v-slot="{ item }" :items="items"
             :ui="{ item: 'not-first:pl-3 basis-auto last:me-4', container: 'p-px max-sm:px-4' }" wheel-gestures
             drag-free>
    <GMCategoryButton :icon="item.icon ?? undefined" :label="item.label" :id="item.id?.toString()" />
  </UCarousel>
</template>

<script lang="ts" setup>
type CategoryCarouselItems = {
  icon?: string | null;
  id?: number;
  label: string;
  parent_id?: number | null;
}[]

const { data } = await useFetch("/api/categories", {
  headers: useRequestHeaders(["cookie"]),
});

const categories = data.value?.categories;

const items: CategoryCarouselItems = [
  { label: "All" },
  ...categories ?? [],
];
</script>