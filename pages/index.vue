<template>
  <UContainer class="flex flex-col items-center justify-center py-20">
    <div class="w-full max-w-4xl">
      <h1 class="text-3xl font-black sm:text-7xl sm:text-center">
        Grow the Muslim Economy
      </h1>
      <p class="mt-5 text-xl sm:text-center">
        Explore Muslim-owned businesses, organizations, products, and more.
      </p>
    </div>
    <UButton class="self-start mt-5 sm:self-center hover:cursor-pointer" size="xl" @click="
      colorMode.value === 'light'
        ? (colorMode.preference = 'dark')
        : (colorMode.preference = 'light')
      ">Get Started</UButton>
    <h2 class="mt-20 text-2xl font-bold">Categories</h2>
    <div class="grid grid-cols-2 gap-4 mt-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <template v-for="category in categories" :key="category.id">
        <UCard class="transition hover:cursor-pointer">
          <div class="flex items-center justify-center">
            <Icon v-if="category.icon" :name="category.icon" class="me-1" />
            <h2>{{ category.label }}</h2>
          </div>
        </UCard>
      </template>
    </div>
  </UContainer>
</template>

<script lang="ts" setup>
const colorMode = useColorMode();

const { data } = await useFetch("/api/categories", {
  headers: useRequestHeaders(["cookie"]),
});

const categories = data.value?.categories;
</script>
