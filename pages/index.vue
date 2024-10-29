<template>
  <div>
    <UContainer class="pt-4 max-sm:px-0">
      <GMCategoryCarousel />
    </UContainer>

    <UContainer class="pt-10">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <template v-for="posting in postings" :key="posting.id">
          <UCard :ui="{ root: 'bg-ui-bg-elevated hover:shadow-md transition hover:cursor-pointer group text-left items-stretch' }"
                 as="button">
            <template #header>
              <img :src="`https://picsum.photos/seed/${posting.id}/200/300`" alt="Random Image"
                   class="w-full h-64! object-cover object-center ring ring-[var(--ui-border)] rounded" />
            </template>
            <div class="flex flex-col gap-2 items-between">
              <div class="flex flex-wrap gap-1">
                <UBadge variant="subtle" size="sm">App</UBadge>
                <UBadge variant="subtle" size="sm">App</UBadge>
              </div>
              <h2 class="font-semibold">{{ posting.title }}</h2>
              <p class="text-sm line-clamp-3 text-ui-text-toned">{{ posting.description }}</p>
            </div>
            <template #footer>
              <p
                 class="text-sm after:content-[''] after:h-px after:w-0 after:bg-[currentColor] relative after:absolute after:-bottom-0.5 after:left-0 group-hover:after:w-full after:transition-all text-ui-primary inline">
                Learn more
              </p>
            </template>
          </UCard>
        </template>
      </div>
    </UContainer>

    <UContainer class="hidden">
      <pre class="pt-10 text-xs">{{ postings }}</pre>
    </UContainer>
  </div>
</template>

<script lang="ts" setup>
const { postings } = usePostings();
</script>