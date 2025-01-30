<template>
  <UCarousel
    v-slot="{ item }"
    ref="carousel"
    :items="items"
    :ui="{
      item: 'flex basis-auto items-center not-first:pl-3 last:me-4',
      container: 'flex p-px max-sm:px-4',
    }"
    wheel-gestures
    drag-free>
    <GMCategoryButton
      :icon="item.icon ?? undefined"
      :label="item.label"
      :category-id="item.id?.toString()" />
  </UCarousel>
</template>

<script lang="ts" setup>
import type { Category } from "~/types/supabase";

type CategoryCarouselItems = (Partial<Category> & { label: string })[];

const { categories } = useCategories();

const items = computed<CategoryCarouselItems>(() => [
  { label: "All" },
  ...(categories.value ?? []),
]);
</script>
