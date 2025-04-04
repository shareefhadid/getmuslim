<template>
  <ULink
    :to="{ path: `/postings/${posting.id}`, query: route.query }"
    @click.prevent="handleClick">
    <UCard
      :ui="{
        root: 'group h-full items-stretch text-left shadow-xs transition ease-in-out hover:cursor-pointer hover:shadow-sm',
        header: 'overflow-hidden rounded-t-[calc(var(--ui-radius)*2)] p-0!',
      }">
      <template #header>
        <div class="aspect-square w-full">
          <template v-if="posting.featured_image">
            <NuxtImg
              class="ring-ui-border-accented h-full w-full object-cover object-center ring transition-transform group-hover:scale-105"
              :src="formatPostingImagePath(posting.featured_image)"
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
          <h2 class="text-ui-text grow truncate text-lg font-semibold">
            {{ posting.title }}
          </h2>
          <p
            class="text-ui-text-muted shrink-0 text-sm font-light"
            v-if="distance">
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
              :onPress="() => (y = 0)"
              :category-id="category.id.toString()" />
          </div>
        </div>
      </template>
    </UCard>
  </ULink>
</template>

<script lang="ts" setup>
import { GMPostingModal } from "#components";
import type { PostingDetails } from "~/types/postings";

const route = useRoute();
const overlay = useOverlay();
const modal = overlay.create(GMPostingModal);
const { y } = useWindowScroll({ behavior: "smooth" });

const props = defineProps<{
  posting: PostingDetails;
}>();

const distance = computed(() => {
  if (!props.posting.distance) return null;

  return formatDistance(props.posting.distance);
});

const handleClick = () => {
  modal.open({ posting: props.posting });
};
</script>
