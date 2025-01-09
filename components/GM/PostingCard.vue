<template>
  <UCard
    :ui="{
      root: 'bg-ui-bg-elevated group items-stretch text-left transition hover:cursor-pointer hover:shadow-md',
      header: 'overflow-hidden rounded-t-[calc(var(--ui-radius)*2)] p-0!',
    }"
    as="button">
    <template #header>
      <div class="aspect-square w-full">
        <template v-if="posting.featured_image">
          <img
            class="h-full w-full object-cover object-center ring ring-[var(--ui-border-accented)] transition-transform group-hover:scale-105"
            :src="posting.featured_image"
            :alt="posting.title" />
        </template>
        <template v-else>
          <div
            class="bg-ui-bg-accented flex h-full w-full items-center justify-center">
            <UIcon
              class="text-ui-text-highlighted h-12 w-12"
              name="i-heroicons-photo" />
          </div>
        </template>
      </div>
    </template>
    <div class="items-between flex flex-col gap-3">
      <div class="grid grid-cols-6 items-baseline gap-x-2">
        <h2 class="col-span-5 text-lg font-semibold">
          {{ posting.title }}
        </h2>
        <p v-if="distance" class="text-ui-text-muted text-sm font-light">
          {{ distance }}
        </p>
      </div>
      <p class="text-ui-text-muted line-clamp-3 text-sm">
        {{ posting.description }}
      </p>
    </div>
    <template #footer>
      <div class="flex flex-wrap gap-1">
        <div v-for="category in posting.categories" :key="category.id">
          <GMCategoryButton
            mode="badge"
            :icon="category.icon || 'i-heroicons-tag'"
            :label="category.label"
            :id="category.id.toString()" />
        </div>
      </div>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
import type { PostingDetails } from "~/types/postings";
import { computed } from 'vue';

const props = defineProps<{
  posting: PostingDetails;
}>();

const distance = computed(() => {
  if (!props.posting.distance) return null;
  
  const distanceInKm = props.posting.distance / 1000;
  
  return distanceInKm < 1
    ? `${distanceInKm.toFixed(1)}km`
    : `${Math.round(distanceInKm)}km`;
});
</script>
