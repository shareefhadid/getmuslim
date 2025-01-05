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
    </UContainer>

    <UContainer class="">
      <pre class="pt-10 text-xs">{{ postings }}</pre>
    </UContainer>
  </div>
</template>

<script lang="ts" setup>
const { postings } = usePostings({ mode: PostingMode.Recent });
</script>
