<template>
  <div class="bg-ui-bg-elevated mt-4 py-2">
    <UContainer
      class="text-ui-text-toned flex flex-col items-center justify-center gap-2 text-center text-sm">
      <p>
        Looking for global Muslim brands? Check out
        <ULink
          class="text-ui-primary hover:text-ui-primary/75 font-medium hover:cursor-pointer"
          to="https://muslimhub.co"
          external
          target="_blank">
          MuslimHub.co
        </ULink>
      </p>
      <UButton
        class="hover:cursor-pointer"
        icon="mdi:rss"
        to="/feed.xml"
        size="xs"
        variant="ghost"
        title="RSS Feed" />
    </UContainer>
  </div>
</template>
