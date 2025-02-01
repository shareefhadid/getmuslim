<template>
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
      ">
      <slot />
    </UButton>
  </ColorScheme>
</template>

<script lang="ts" setup>
const colorMode = useColorMode();
</script>
