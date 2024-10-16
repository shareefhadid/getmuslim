<template>
  <UContainer class="flex flex-col items-center justify-center w-full min-h-screen">
    <div class="w-full max-w-4xl sm:text-center rounded-xl">
      <h1 class="text-4xl font-black sm:text-5xl md:text-7xl sm:text-center">
        Grow the Muslim Economy
      </h1>
      <p class="mt-5 mb-4 text-lg font-medium md:text-xl sm:text-center">
        Explore Muslim-owned businesses, organizations, products, and more.
      </p>
      <UButton class="hover:cursor-pointer" icon="i-heroicons-rocket-launch" color="neutral" @click="
        colorMode.value === 'light'
          ? (colorMode.preference = 'dark')
          : (colorMode.preference = 'light')
        ">Get Started</UButton>
    </div>
  </UContainer>

</template>

<script lang="ts" setup>
const colorMode = useColorMode();
</script>
