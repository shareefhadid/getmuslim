<template>
  <header
    class="sticky top-0 z-50 -mb-px border-b border-[var(--ui-border)] bg-[var(--ui-bg)]/90 py-4 backdrop-blur-md">
    <UContainer>
      <div class="flex justify-between">
        <ULink
          class="flex items-center justify-center gap-x-2 transition-opacity hover:opacity-[.85]"
          to="/">
          <GMLogo size="32" />
          <p
            class="text-lg leading-none font-semibold text-[var(--ui-text-highlighted)]">
            getmuslim
          </p>
        </ULink>
        <ColorScheme>
          <UButton
            class="hover:cursor-pointer"
            :icon="colorMode.value === 'light' ? 'lucide:sun' : 'lucide:moon'"
            variant="link"
            color="neutral"
            @click="
              colorMode.value === 'light'
                ? (colorMode.preference = 'dark')
                : (colorMode.preference = 'light')
            " />
        </ColorScheme>
      </div>
    </UContainer>
  </header>
</template>

<script lang="ts" setup>
const colorMode = useColorMode();
</script>
