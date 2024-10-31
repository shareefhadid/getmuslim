<template>
  <div>
    <UContainer class="pt-4 max-sm:px-0">
      <GMCategoryCarousel />
    </UContainer>

    <UContainer class="pt-10">
      <div
        class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <template v-for="posting in postings" :key="posting.id">
          <UCard
            :ui="{
              root: 'bg-ui-bg-elevated group items-stretch text-left transition hover:cursor-pointer hover:shadow-md',
            }"
            as="button">
            <template #header>
              <img
                class="h-64 w-full object-cover object-center ring ring-[var(--ui-border-accented)]"
                :src="`https://picsum.photos/seed/${posting.id}/200/300`"
                alt="Random Image" />
            </template>
            <div class="items-between flex flex-col gap-2">
              <div class="flex flex-wrap gap-1">
                <UBadge variant="subtle" size="sm">App</UBadge>
                <UBadge variant="subtle" size="sm">App</UBadge>
              </div>
              <h2 class="font-semibold">{{ posting.title }}</h2>
              <p class="text-ui-text-toned line-clamp-3 text-sm">
                {{ posting.description }}
              </p>
            </div>
            <template #footer>
              <p
                class="text-ui-primary relative inline text-sm after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-[currentColor] after:transition-all after:content-[''] group-hover:after:w-full">
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
