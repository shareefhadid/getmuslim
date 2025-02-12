<template>
  <UModal
    :ui="{
      title: 'sr-only',
      description: 'sr-only',
      content: 'overflow-hidden rounded-sm',
    }"
    :title="posting.title"
    :description="posting.description">
    <template #content>
      <div class="relative min-h-0 grow overflow-scroll" ref="scroll">
        <UButton
          class="ring-ui-border-inverted/20 fixed top-2 right-2 z-10 ring hover:cursor-pointer"
          icon="mdi:close"
          variant="soft"
          size="xs"
          @click="modal.close"
          color="neutral" />

        <div class="flex flex-col gap-y-6">
          <div class="bg-ui-bg-elevated w-full">
            <template v-if="posting.featured_image">
              <NuxtImg
                class="aspect-square w-full object-cover object-center"
                :src="posting.featured_image"
                :alt="posting.title" />
            </template>
            <template v-else>
              <div
                class="bg-ui-bg-accented flex aspect-square w-full items-center justify-center rounded-sm">
                <UIcon class="text-ui-text h-12 w-12" name="lucide:image" />
              </div>
            </template>
          </div>

          <div class="flex flex-col gap-4 px-4 pb-6 sm:px-6">
            <h2 class="text-xl font-bold">{{ posting.title }}</h2>
            <div v-if="posting.categories.length > 0">
              <div class="flex flex-wrap gap-3">
                <template
                  v-for="category in posting.categories"
                  :key="category.id">
                  <GMCategoryButton
                    mode="badge"
                    :icon="category.icon || 'lucide:tags'"
                    :label="category.label"
                    :category-id="category.id.toString()"
                    :onPress="() => modal.close()" />
                </template>
              </div>
            </div>
            <p
              class="text-ui-text-muted text-sm"
              v-if="posting.address && posting.show_address">
              {{ posting.address }}{{ formattedDistance }}
            </p>
            <p class="text-ui-text-muted">{{ posting.description }}</p>
            <div>
              <div class="flex flex-wrap gap-3">
                <ULink
                  class="inline-flex items-center gap-x-1 text-sm hover:cursor-pointer"
                  @click="copyLink">
                  <UIcon name="mdi:content-copy" />
                  Copy link
                </ULink>
                <ULink
                  class="inline-flex items-center gap-x-1 text-sm"
                  v-if="posting.google_maps"
                  :to="posting.google_maps"
                  target="_blank"
                  external>
                  <UIcon name="mdi:google-maps" />
                  Directions
                </ULink>
                <ULink
                  class="inline-flex items-center gap-x-1 text-sm"
                  v-if="posting.website"
                  :to="posting.website"
                  target="_blank"
                  external>
                  <UIcon name="mdi:web" />
                  Website
                </ULink>
                <ULink
                  class="inline-flex items-center gap-x-1 text-sm"
                  v-if="posting.email"
                  :to="`mailto:${posting.email}`"
                  target="_blank"
                  external>
                  <UIcon name="mdi:email" />
                  {{ posting.email }}
                </ULink>
                <ULink
                  class="inline-flex items-center gap-x-1 text-sm"
                  v-if="posting.phone"
                  :to="`tel:${posting.phone}`"
                  target="_blank"
                  external>
                  <UIcon name="mdi:phone" />
                  {{ posting.phone }}
                </ULink>
              </div>
            </div>
            <small class="text-ui-text-dimmed" v-if="posting.updated_at">
              last updated
              {{ new Date(posting.updated_at).toLocaleDateString() }}
            </small>
          </div>
        </div>
        <div
          class="from-0 pointer-events-none fixed inset-x-0 bottom-0 z-20 flex h-7 items-end justify-center bg-gradient-to-t from-[var(--ui-bg)] to-[var(--ui-bg)]/[0.2] text-xs"
          v-show="showScroll">
          <UIcon class="mb-1 animate-bounce" name="mdi:arrow-down" />
        </div>
      </div>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import type { PostingDetails } from "~/types/postings";

const modal = useModal();
const clipboard = useClipboard();
const toast = useToast();

const el = useTemplateRef<HTMLElement>("scroll");
const { arrivedState, y } = useScroll(el);

const showScroll = computed(() => !arrivedState.bottom);

watch(modal.isOpen, (open) => {
  if (open) {
    setTimeout(() => {
      y.value = 1;
      y.value = 0;
    }, 0);
  }
});

const props = defineProps<{
  posting: PostingDetails;
}>();

const formattedDistance = computed(() => {
  if (!props.posting.distance) return "";

  const distance = formatDistance(props.posting.distance);

  return ` (${distance} away)`;
});

const copyLink = async () => {
  toast.clear();
  try {
    await clipboard.copy(
      `${window.location.origin}/postings/${props.posting.id}`,
    );
    await toast.add({
      description: "Copied to clipboard.",
      color: "success",
      duration: 2000,
    });
  } catch (error) {
    await toast.add({
      description: "Unable to copy.",
      color: "error",
      duration: 2000,
    });
    console.error(error);
  }
};
</script>
