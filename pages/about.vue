<template>
  <UContainer class="w-full py-12">
    <div
      class="xs:align-center xs:text-center mx-auto flex min-h-[80vh] max-w-4xl flex-col justify-center gap-5 sm:gap-6 md:gap-7">
      <h1 class="text-4xl font-black sm:text-center sm:text-5xl md:text-7xl">
        Grow the Muslim Economy
      </h1>
      <p class="text-lg font-medium sm:text-xl md:text-2xl">
        Explore Muslim-owned businesses and organizations
      </p>
      <UButton
        class="xs:self-center self-start"
        to="/"
        icon="mdi:rocket-launch-outline">
        Get started
      </UButton>
      <p class="text-ui-text-dimmed">
        getmuslim is a community-driven platform connecting people with
        Muslim-owned businesses and organizations. Our goal is to strengthen the
        Muslim economy by making it easier to discover and support local Muslim
        entrepreneurs.
      </p>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
usePageMeta({
  title: "About",
  description:
    "getmuslim connects you with Muslim-owned businesses and organizations. Our mission is to strengthen the Muslim economy by making it easier to discover and support local Muslim entrepreneurs.",
});

useSchemaOrg([
  defineWebPage({
    '@type': 'AboutPage',
    name: 'About getmuslim',
    description: 'Grow the Muslim Economy by connecting with local Muslim-owned businesses and organizations.',
    mainContentOfPage: 'Explore Muslim-owned businesses and organizations'
  })
]);
</script>
