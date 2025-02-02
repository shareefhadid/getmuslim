<template>
  <header
    class="sticky top-0 z-50 -mb-px border-b border-[var(--ui-border)] bg-[var(--ui-bg)]/90 py-4 backdrop-blur-md">
    <UContainer>
      <div class="flex justify-between">
        <ULink
          class="flex items-center justify-center gap-x-2 transition-opacity hover:opacity-[.85]"
          :to="{ path: '/', query: route.query }">
          <GMLogo size="32" />
          <p
            class="text-lg leading-none font-semibold text-[var(--ui-text-highlighted)]">
            getmuslim
          </p>
        </ULink>
        <UButton
          class="hover:cursor-pointer"
          data-tally-open="mBjb0R"
          data-tally-hide-title="1"
          data-tally-overlay="1"
          data-tally-width="420"
          data-tally-auto-close="2000">
          Submit posting
        </UButton>
      </div>
    </UContainer>
  </header>
</template>

<script lang="ts" setup>
const route = useRoute();
</script>
