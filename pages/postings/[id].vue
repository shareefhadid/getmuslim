<template>
  <UContainer class="w-full py-12">
    <div
      class="mx-auto flex w-4xl max-w-full flex-col items-center gap-y-8"
      v-if="posting">
      <template v-if="posting.featured_image">
        <NuxtImg
          class="aspect-square rounded-lg object-cover object-center transition-transform"
          :src="posting.featured_image"
          :alt="posting.title" />
      </template>

      <div class="flex flex-col gap-y-4 text-center">
        <h2
          class="xs:text-3xl text-2xl font-bold sm:text-4xl"
          v-if="posting.title">
          {{ posting.title }}
        </h2>
        <div v-if="posting.categories.length > 0">
          <div
            class="flex flex-wrap justify-center gap-3"
            v-for="category in posting.categories"
            :key="category.id">
            <GMCategoryButton
              mode="badge"
              :icon="category.icon || 'lucide:tags'"
              :label="category.label"
              :category-id="category.id.toString()"
              :onPress="(categoryId) => handleCategoryPressed(categoryId)" />
          </div>
        </div>
        <p
          class="text-ui-text-muted text"
          v-if="posting.address && !posting.show_address">
          {{ posting.address }}{{ formattedDistance }}
        </p>
        <p class="text-ui-text-toned" v-if="posting.description">
          {{ posting.description }}
        </p>
        <div v-if="posting.links.length > 0">
          <div class="flex flex-wrap justify-center gap-3">
            <template v-for="link in posting.links" :key="link.id">
              <ULink
                class="inline-flex items-center gap-x-1"
                :href="link.url"
                external
                target="_blank">
                <UIcon v-if="link.type.icon" :name="link.type.icon" />
                {{ link.type.label }}
              </ULink>
            </template>
          </div>
        </div>
        <small class="text-ui-text-dimmed mt-3" v-if="posting.updated_at">
          last updated {{ new Date(posting.updated_at).toLocaleDateString() }}
        </small>
      </div>
    </div>
    <div class="flex flex-col items-center gap-y-3 py-10 text-center" v-else>
      <h2 class="text-2xl">😕 Unable to find posting</h2>
      <UButton class="cursor-pointer" color="neutral" to="/">
        Return home
      </UButton>
    </div>
    <pre class="mt-100 max-w-full text-wrap">{{ posting }} {{ error }}</pre>
  </UContainer>
</template>
<script setup lang="ts">
const route = useRoute();
const params = ref({
  id: parseInt(route.params.id as string),
});

const handleCategoryPressed = async (id: string) => {
  await navigateTo({
    path: "/",
    query: {
      category: id,
      page: undefined,
    },
  });
};

const { posting, error } = usePosting(params);

const formattedDistance = computed(() => {
  if (!posting.value?.distance) return "";

  const distance = formatDistance(posting.value.distance);

  return ` (${distance} away)`;
});
</script>
