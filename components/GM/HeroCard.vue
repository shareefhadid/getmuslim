<template>
  <UContainer
    class="flex min-h-screen w-full flex-col items-center justify-center">
    <div class="w-full max-w-4xl rounded-xl sm:text-center">
      <h1 class="text-4xl font-black sm:text-center sm:text-5xl md:text-7xl">
        Grow the Muslim Economy
      </h1>
      <p class="mt-5 mb-4 text-lg font-medium sm:text-center md:text-xl">
        Explore Muslim-owned businesses, organizations, products, and more.
      </p>
      <UButton
        class="hover:cursor-pointer"
        icon="i-heroicons-rocket-launch"
        color="neutral"
        @click="
          colorMode.value === 'light'
            ? (colorMode.preference = 'dark')
            : (colorMode.preference = 'light')
        ">
        Get Started
      </UButton>
    </div>
  </UContainer>
</template>

<script lang="ts" setup>
const colorMode = useColorMode();
</script>
