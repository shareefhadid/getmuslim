<template>
  <header class="sticky top-0 z-50 py-3 rounded ring ring-ui-border backdrop-blur-md bg-ui-bg/90">
    <UContainer>
      <div class="flex justify-between">
        <div class="flex items-center justify-center gap-x-2">
          <GMLogo />
          <p class="font-semibold text-[var(--ui-text-highlighted)] text-lg leading-none">getmuslim</p>
        </div>
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
</template>

<script lang="ts" setup>
const colorMode = useColorMode();
</script>