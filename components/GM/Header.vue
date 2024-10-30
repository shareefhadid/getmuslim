<template>
  <header
    class="sticky top-0 z-50 -mb-px border-b border-[var(--ui-border)] bg-[var(--ui-bg)]/75 py-3 backdrop-blur">
    <UContainer>
      <div class="flex justify-between">
        <div class="flex items-center justify-center gap-x-2">
          <GMLogo />
          <p
            class="text-lg font-semibold leading-none text-[var(--ui-text-highlighted)]">
            getmuslim
          </p>
        </div>
        <UButton
          class="hover:cursor-pointer"
          :icon="
            colorMode.preference === 'light'
              ? 'heroicons:sun'
              : 'heroicons:moon'
          "
          variant="link"
          color="neutral"
          @click="
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
