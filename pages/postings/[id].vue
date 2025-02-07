<template>
  <UContainer class="w-full pt-6 pb-16 flex flex-col justify-center">
    <div
      class="mx-auto grid w-5xl max-w-full grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-[35%_1fr]"
      v-if="posting">
      <div class="flex flex-col gap-4">
        <template v-if="posting.featured_image">
          <NuxtImg
            class="aspect-square w-lg max-w-full rounded-md object-cover object-center"
            :src="posting.featured_image"
            :alt="posting.title" />
        </template>
      </div>

      <div class="flex flex-col gap-4">
        <h1
          class="xs:text-3xl text-2xl font-bold md:text-4xl"
          v-if="posting.title">
          {{ posting.title }}
        </h1>
        <div v-if="posting.categories.length > 0">
          <div class="flex flex-wrap gap-3">
            <template v-for="category in posting.categories" :key="category.id">
              <GMCategoryButton
                mode="badge"
                :set-route="false"
                :icon="category.icon || 'lucide:tags'"
                :label="category.label"
                :category-id="category.id.toString()"
                :onPress="(categoryId) => handleCategoryPressed(categoryId)" />
            </template>
          </div>
        </div>
        <p
          class="text-ui-text-muted text-sm"
          v-if="posting.address && posting.show_address">
          {{ posting.address }}{{ formattedDistance }}
        </p>
        <p class="text-ui-text-toned" v-if="posting.description">
          {{ posting.description }}
        </p>
        <div class="flex flex-wrap gap-3 text-sm">
          <ULink
            class="inline-flex items-center gap-x-1 hover:cursor-pointer"
            @click="copyLink">
            <UIcon name="mdi:content-copy" />
            Copy link
          </ULink>
          <ULink
            class="inline-flex items-center gap-x-1 hover:cursor-pointer"
            v-if="posting.google_maps"
            :to="posting.google_maps"
            target="_blank"
            external>
            <UIcon name="mdi:google-maps" />
            Directions
          </ULink>
          <ULink
            class="inline-flex items-center gap-x-1 hover:cursor-pointer"
            v-if="posting.website"
            :to="posting.website"
            target="_blank"
            external>
            <UIcon name="mdi:web" />
            Website
          </ULink>
          <ULink
            class="inline-flex items-center gap-x-1 hover:cursor-pointer"
            v-if="posting.email"
            :to="`mailto:${posting.email}`"
            target="_blank"
            external>
            <UIcon name="mdi:email" />
            {{ posting.email }}
          </ULink>
          <ULink
            class="inline-flex items-center gap-x-1 hover:cursor-pointer"
            v-if="posting.phone"
            :to="`tel:${posting.phone}`"
            target="_blank"
            external>
            <UIcon name="mdi:phone" />
            {{ posting.phone }}
          </ULink>
        </div>
        <ClientOnly>
          <small class="text-ui-text-dimmed" v-if="posting.updated_at">
            last updated
            {{ new Date(posting.updated_at).toLocaleDateString() }}
          </small>
        </ClientOnly>
      </div>
    </div>

    <div v-else-if="isLoading" />
    <div class="flex flex-col items-center gap-y-3 py-10 text-center" v-else>
      <h2 class="text-2xl">😕 Unable to find posting</h2>
      <UButton
        class="cursor-pointer"
        color="neutral"
        :to="{ path: '/', query: route.query }">
        Return home
      </UButton>
    </div>
  </UContainer>
</template>
<script setup lang="ts">
const clipboard = useClipboard();
const toast = useToast();
const route = useRoute();

const copyLink = async () => {
  toast.clear();
  try {
    await clipboard.copy(`${window.location.origin}${route.fullPath}`);
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

const params = ref({
  id: parseInt(route.params.id as string),
});

const handleCategoryPressed = async (id: string) => {
  await navigateTo({
    path: "/",
    query: {
      ...route.query,
      category: id,
      page: undefined,
    },
  });
};

const { posting, error, isLoading } = await usePosting(params);

const formattedDistance = computed(() => {
  if (!posting.value?.distance) return "";

  const distance = formatDistance(posting.value.distance);

  return ` (${distance} away)`;
});

usePageMeta({
  title: posting.value?.title ?? "Posting Not Found",
  description: posting.value?.description ?? "This posting could not be found.",
  image: posting.value?.featured_image ?? undefined,
});

useSchemaOrg([
  defineLocalBusiness({
    name: posting.value?.title,
    description: posting.value?.description,
    image: posting.value?.featured_image,
    location: posting.value?.address,
    url: posting.value
      ? `${useRuntimeConfig().public.siteUrl}/postings/${posting.value.id}`
      : undefined,
    dateModified: posting.value?.updated_at,
  }),
]);
</script>
