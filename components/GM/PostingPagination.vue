<template>
  <template v-if="totalPages > 1">
    <UPagination
      :page="page"
      :items-per-page="1"
      :show-controls="totalPages > 3"
      :to="toPage"
      :total="totalPages"
      :ui="{ label: 'hover:cursor-pointer' }"
      size="sm"
      active-color="neutral" />
  </template>
</template>

<script lang="ts" setup>
const route = useRoute();

defineProps<{
  page: number;
  totalPages: number;
}>();

function toPage(pageNum: number) {
  return {
    query: {
      ...route.query,
      page: pageNum,
    },
  };
}
</script>
