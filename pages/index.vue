<template>
  <div>
    <UContainer class="pt-4 max-sm:px-0">
      <GMCategoryCarousel />
    </UContainer>

    <UContainer class="mt-12">
      <GMSortSelect />
    </UContainer>

    <UContainer class="pt-6 pb-10">
      <div v-if="postings.length > 0">
        <div
          class="xs:grid-cols-2 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
          <template v-for="posting in postings" :key="posting.id">
            <GMPostingCard :posting="posting" />
          </template>
        </div>
        <div class="flex flex-row justify-center pt-16">
          <GMPostingPagination
            :page="page"
            :total-pages="pagination.totalPages" />
        </div>
      </div>
      <div
        class="flex flex-col items-center justify-center gap-y-2 py-8 text-center"
        v-else>
        <p class="text-ui-accented text-2xl">🤔 No postings found</p>
        <UButton to="/" variant="link" size="xl" color="neutral">
          Reset filters
        </UButton>
      </div>
    </UContainer>

    <UContainer class="hidden">
      <pre class="pt-10 text-xs">{{ postings }}</pre>
      <pre class="pt-10 text-xs">{{ pagination }}</pre>
    </UContainer>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute();

const locationCookie = useLocationCookie();

// Pagination
const page = computed(() => Number(route.query.page) || 1);

// Initialize sortMode based on URL
const sortMode = computed<PostingMode>(() =>
  route.query.sort === "nearby" && locationCookie.value.isSet
    ? PostingMode.Nearby
    : PostingMode.Recent,
);

// Fetch postings
const params = computed<PostingsParams>(() => ({
  page: page.value,
  mode: sortMode.value,
  category: Number(route.query.category) || undefined,
  lat: locationCookie.value.lat,
  long: locationCookie.value.long,
}));

const { postings, pagination } = usePostings(params);
</script>
