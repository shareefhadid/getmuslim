<template>
  <div>
    <header class="sticky top-0 z-40 py-3 rounded shadow ring ring-ui-border backdrop-blur bg-ui-bg/60">
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
    <UContainer class="pt-4 pb-[100vh]">
      <div class="flex flex-row gap-3 py-3 sm:flex-wrap">
        <div
             class="px-3 py-1 transition-all duration-300 rounded-full shadow-sm hover:bg-ui-bg-elevated hover:shadow hover:cursor-pointer ring ring-ui-border">
          <div class="flex items-center text-sm gap-x-1">
            <Icon name="mdi:filter-off" size="1.4em" class="text-ui-primary" />
            <p class="font-medium">All</p>
          </div>
        </div>
        <template v-for="category in categories">
          <div
               class="px-3 py-1 transition-all duration-300 rounded-full shadow-sm hover:bg-ui-bg-elevated hover:shadow hover:cursor-pointer ring ring-ui-border">
            <div class="flex items-center text-sm gap-x-1">
              <Icon v-if="category.icon" :name="category.icon" size="1.4em" class="text-ui-primary" />
              <p class="font-medium">{{ category.label }}</p>
            </div>
          </div>
        </template>
      </div>
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