<template>
  <UCard
    :ui="{
      root: 'bg-ui-bg-elevated group items-stretch text-left transition hover:cursor-pointer hover:shadow-md',
      header: 'p-0! overflow-hidden rounded-t-[calc(var(--ui-radius)*2)]',
    }"
    as="button">
    <template #header>
      <div class="aspect-square w-full">
        <template v-if="posting.featured_image">
          <img
            class="h-full w-full object-cover object-center ring ring-ui-border-accented transition-transform group-hover:scale-105"
            :src="posting.featured_image"
            :alt="posting.title" />
        </template>
        <template v-else>
          <div
            class="bg-ui-bg-accented flex h-full w-full items-center justify-center transition-transform group-hover:scale-105">
            <UIcon class="text-ui-text h-12 w-12" name="i-heroicons-photo" />
          </div>
        </template>
      </div>
    </template>
    <div class="items-between gap-3 flex flex-col">
      <div class="gap-x-2 grid grid-cols-6 items-baseline">
        <h2 class="text-lg col-span-5 font-semibold">
          {{ posting.title }}
        </h2>
        <p class="text-ui-text-muted text-sm font-light" v-if="distance">
          {{ distance }}
        </p>
      </div>
      <p class="text-ui-text-muted text-sm line-clamp-3">
        {{ posting.description }}
      </p>
    </div>
    <template #footer>
      <div class="gap-1 flex flex-wrap">
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
import { computed } from "vue";
import type { PostingDetails } from "~/types/postings";

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
