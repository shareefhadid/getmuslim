<template>
  <UCarousel v-slot="{ item }" :items="categories ?? undefined"
             :ui="{ item: 'not-first:pl-3 basis-auto last:me-4', container: 'p-px max-sm:px-4' }" wheel-gestures
             drag-free>
    <GMCategoryButton :icon="item.icon ?? undefined" :label="item.label" />
  </UCarousel>
</template>

<script lang="ts" setup>
const { data } = await useFetch("/api/categories", {
  headers: useRequestHeaders(["cookie"]),
});

const categories = data.value?.categories;
</script>