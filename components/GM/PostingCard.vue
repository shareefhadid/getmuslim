<template>
  <UCard
    :ui="{
      root: 'group items-stretch text-left transition hover:cursor-pointer hover:shadow-md',
      header: 'overflow-hidden rounded-t-[calc(var(--ui-radius)*2)] p-0!',
    }">
    <template #header>
      <div class="aspect-square w-full">
        <template v-if="posting.featured_image">
          <img
            class="ring-ui-border-accented h-full w-full object-cover object-center ring transition-transform group-hover:scale-105"
            :src="posting.featured_image"
            :alt="posting.title" />
        </template>
        <template v-else>
          <div
            class="bg-ui-bg-accented flex h-full w-full items-center justify-center transition-transform group-hover:scale-105">
            <UIcon class="text-ui-text h-12 w-12" name="lucide:image" />
          </div>
        </template>
      </div>
    </template>
    <div class="items-between flex flex-col gap-3">
      <div class="flex items-baseline gap-x-2">
        <h2 class="grow text-lg font-semibold">
          {{ posting.title }}
        </h2>
        <p class="text-ui-text-muted text-sm font-light" v-if="distance">
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
            :icon="category.icon || 'lucide:tags'"
            :label="category.label"
            :category-id="category.id.toString()" />
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

  if (distanceInKm > 100) {
    return "100 km+";
  } else if (distanceInKm >= 1) {
    return `${Math.round(distanceInKm)} km`;
  } else {
    return `${distanceInKm.toFixed(1)} km`;
  }
});
</script>
