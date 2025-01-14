<template>
  <div>
    <UContainer class="pt-4 max-sm:px-0">
      <GMCategoryCarousel />
    </UContainer>

    <UContainer class="py-10">
      <div
        class="xs:grid-cols-2 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        <template v-for="posting in postings" :key="posting.id">
          <GMPostingCard :posting="posting" />
        </template>
      </div>
      <div class="flex flex-row justify-center py-10">
        <UPagination
          :page="page"
          :items-per-page="1"
          show-controls
          :to="to"
          :total="pagination.totalPages"
          variant="subtle"
          :ui="{ label: 'hover:cursor-pointer' }"
          size="sm"
          active-color="neutral" />
      </div>
    </UContainer>

    <UContainer class="">
      <pre class="pt-10 text-xs">{{ postings }}</pre>
      <pre class="pt-10 text-xs">{{ pagination }}</pre>
    </UContainer>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute();
const page = computed(() => Number(route.query.page) || 1);
const params = computed(() => ({
  page: page.value,
  mode: PostingMode.Recent,
}));

function to(pageNum: number) {
  return {
    query: {
      ...route.query,
      page: pageNum,
    },
  };
}

const { postings, pagination } = usePostings(params);
</script>
