<template>
  <UCarousel v-slot="{ item }" :items="items"
             :ui="{ item: 'not-first:pl-3 basis-auto last:me-4 flex', container: 'p-px max-sm:px-4 flex' }" wheel-gestures
             drag-free>
    <GMCategoryButton :icon="item.icon ?? undefined" :label="item.label" :id="item.id?.toString()" />
  </UCarousel>
</template>

<script lang="ts" setup>
import type { Categories } from '~/types/supabase';

type CategoryCarouselItems = (Partial<Categories> & { label: string })[];

const { categories, fetchCategories } = useCategories();

await fetchCategories();

const items = computed<CategoryCarouselItems>(() => [
  { label: "All" },
  ...categories.value ?? [],
])
</script>