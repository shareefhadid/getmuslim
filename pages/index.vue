<template>
  <div>
    <UContainer class="pt-4 max-sm:px-0">
      <GMCategoryCarousel />
    </UContainer>

    <UContainer class="py-10">
      <div
        class="xs:grid-cols-2 gap-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
        <template v-for="posting in postings" :key="posting.id">
          <GMPostingCard :posting="posting" />
        </template>
      </div>
      <div class="py-10 flex flex-row justify-center">
        <UPagination
          v-model="page"
          :items-per-page="1"
          show-controls
          :total="pagination.totalPages"
          variant="subtle"
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
const page = ref(1);
const { postings, pagination } = usePostings({ mode: PostingMode.Recent });
</script>
