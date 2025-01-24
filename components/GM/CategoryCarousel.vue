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
      :onPress="() => carousel?.emblaApi?.scrollTo(0)"
      :label="item.label"
      :category-id="item.id?.toString()" />
  </UCarousel>
</template>

<script lang="ts" setup>
import type { Category } from "~/types/supabase";

const carousel = useTemplateRef("carousel");

type CategoryCarouselItems = (Partial<Category> & { label: string })[];

const { categories } = useCategories();
const route = useRoute();
const selectedCategory = computed(() => Number(route.query.category) || 0);

const items = computed<CategoryCarouselItems>(() => {
  const activeCategory = categories.value.find(
    (category) => category.id === selectedCategory.value,
  );

  const otherCategories = categories.value.filter(
    (category) => category.id !== selectedCategory.value,
  );

  if (activeCategory) {
    return [{ label: "All" }, activeCategory, ...otherCategories];
  } else {
    return [{ label: "All" }, ...(categories.value ?? [])];
  }
});
</script>
