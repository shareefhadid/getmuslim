<template>
  <div>
    <div
      class="bg-ui-bg-elevated/70 border-ui-border mt-px mb-10 border-y py-20">
      <UContainer class="w-full">
        <div
          class="xs:text-center mx-auto flex w-3xl max-w-full flex-col gap-y-6">
          <h1 class="text-3xl font-bold sm:text-4xl">
            Support 🤝 Local
            <span class="text-ui-primary">Muslim</span>
            Businesses
          </h1>
          <p class="text-ui-text-muted text-lg font-medium">
            Discover and support Muslim-owned businesses and organizations in
            your community. Find everything from restaurants to services, all in
            one place.
          </p>
          <GMSearchButton />
        </div>
      </UContainer>
    </div>

    <div class="py-10" id="results">
      <UContainer class="max-sm:px-0">
        <GMCategoryCarousel />
      </UContainer>
      <UContainer class="mt-12">
        <GMSortSelect />
      </UContainer>
      <UContainer class="py-6">
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
        <div v-else-if="isLoading" />
        <div
          class="flex flex-col items-center justify-center gap-y-2 py-8 text-center"
          v-else>
          <p class="text-ui-accented text-2xl">🤔 No postings found</p>
          <UButton to="/" variant="link" size="xl" color="neutral">
            Reset filters
          </UButton>
        </div>
      </UContainer>
    </div>
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

const { postings, pagination, isLoading } = await usePostings(params);

usePageMeta({
  title: "Find Muslim-owned Businesses",
  description:
    "Discover and support Muslim-owned businesses and organizations in your area. Browse local halal restaurants, Islamic centers, and more.",
});
</script>
