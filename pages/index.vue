<template>
  <div>
    <header class="sticky top-0 z-50 py-3 rounded ring ring-ui-border backdrop-blur bg-ui-bg/60">
      <UContainer>
        <div class="flex justify-between">
          <p class="font-semibold text-[var(--ui-text-highlighted)] text-lg">getmuslim</p>
          <UButton class="hover:cursor-pointer"
                   :icon="colorMode.preference === 'light' ? 'heroicons:sun' : 'heroicons:moon'" variant="link"
                   color="neutral" @click="
                    colorMode.value === 'light'
                      ? (colorMode.preference = 'dark')
                      : (colorMode.preference = 'light')
                    " />
        </div>
      </UContainer>
    </header>
    <UContainer class="pt-4 max-sm:px-0">
      <UCarousel v-slot="{ item }" :items="categories ?? undefined"
                 :ui="{ item: 'basis-auto last:me-4', container: 'py-1 max-sm:px-4' }" wheel-gestures drag-free>
        <GMCategoryChip :icon="item.icon ?? undefined" :label="item.label" />
      </UCarousel>
    </UContainer>
  </div>
</template>

<script lang="ts" setup>
const { data } = await useFetch("/api/categories", {
  headers: useRequestHeaders(["cookie"]),
});

const colorMode = useColorMode();

const categories = data.value?.categories;
</script>