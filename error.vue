<template>
  <div class="flex min-h-screen flex-col">
    <GMHeader />
    <UContainer
      class="flex flex-grow flex-col items-center justify-center py-16 text-center">
      <div class="mx-auto flex max-w-2xl flex-col gap-6">
        <h1 class="text-4xl font-bold">
          <span v-if="error?.statusCode === 404">404 - Page Not Found</span>
          <span v-else>Oops! Something went wrong</span>
        </h1>

        <p class="text-ui-text-toned text-xl" v-if="error?.statusCode === 404">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <p class="text-ui-text-toned text-xl" v-else>
          We're sorry, but something went wrong on our end.
        </p>

        <UButton
          class="self-center font-semibold hover:cursor-pointer"
          size="lg"
          color="primary"
          icon="mdi:home"
          @click="handleError">
          Go home
        </UButton>
      </div>
    </UContainer>
    <GMFooter />
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from "#app";

const { error } = defineProps({
  error: Object as () => NuxtError,
});

const handleError = () => clearError({ redirect: "/" });

usePageMeta({
  title: "Page Not Found",
  description:
    "Sorry, the page you're looking for doesn't exist or has been moved.",
});

useHead({
  htmlAttrs: {
    class: "dark h-full scroll-smooth",
  },
});
</script>
