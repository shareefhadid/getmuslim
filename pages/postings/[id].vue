<template>
  <UContainer class="w-full py-10">
    <div class="flex flex-col items-center" v-if="posting">
      <div class="md:pr-4">
        <template v-if="posting.featured_image">
          <NuxtImg
            class="ring-ui-border-accented w- aspect-square object-cover object-center ring transition-transform group-hover:scale-105"
            :src="posting.featured_image"
            :alt="posting.title" />
        </template>
      </div>
      <div>
        <h2 class="text-2xl font-semibold" v-if="posting.title">
          {{ posting.title }}
        </h2>
        <p
          class="text-ui-text-muted mt-3 line-clamp-3 text-sm"
          v-if="posting.description">
          {{ posting.description }}
        </p>
        <div
          class="mt-3 flex flex-wrap gap-1"
          v-if="posting?.categories && posting?.categories.length > 0">
          <div v-for="category in posting.categories" :key="category.id">
            <GMCategoryButton
              mode="badge"
              :icon="category.icon || 'lucide:tags'"
              :label="category.label"
              :category-id="category.id.toString()"
              :onPress="(categoryId) => handleCategoryPressed(categoryId)" />
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col items-center gap-y-3 py-10 text-center" v-else>
      <h2 class="text-2xl">😕 Unable to find posting</h2>
      <UButton class="cursor-pointer" color="neutral" to="/">
        Return home
      </UButton>
    </div>
    <pre>{{ posting }} {{ error }}</pre>
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
</script>
