<template>
  <header
    class="border-ui-border bg-ui-bg/90 sticky top-0 z-50 -mb-px py-4 transition-all duration-300 ease-in-out"
    :class="dynamicClasses">
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
const { y } = useWindowScroll();

const dynamicClasses = computed(() =>
  y.value > 1 ? ["border-b", "backdrop-blur-md", "shadow-xs"] : [],
);
</script>
