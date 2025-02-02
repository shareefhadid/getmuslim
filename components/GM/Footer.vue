<template>
  <div class="bg-ui-bg-elevated/70 mt-4 py-6">
    <UContainer
      class="xs:items-center xs:text-center flex flex-col justify-center gap-5 text-sm">
      <p class="text-ui-text-toned">
        Looking for global Muslim brands? Check out
        <ULink
          class="text-ui-primary hover:text-ui-primary/75 font-medium hover:cursor-pointer"
          to="https://muslimhub.co"
          external
          target="_blank">
          MuslimHub.co
        </ULink>
      </p>
      <div class="text-md xs:flex-row flex flex-col gap-4">
        <ULink to="/">Home</ULink>
        <ULink to="/about">About</ULink>
        <ULink
          class="self-start hover:cursor-pointer"
          data-tally-open="wgJWqJ"
          data-tally-layout="modal"
          data-tally-width="420"
          data-tally-hide-title="1"
          data-tally-overlay="1">
          Contact
        </ULink>
      </div>
      <div class="flex gap-2">
        <UButton
          class="hover:cursor-pointer"
          icon="mdi:rss"
          to="/feed.xml"
          external
          size="xs"
          variant="ghost"
          title="RSS Feed" />
        <ColorScheme>
          <UButton
            class="hover:cursor-pointer"
            :icon="colorMode.value === 'light' ? 'lucide:sun' : 'lucide:moon'"
            size="xs"
            variant="ghost"
            @click="
              colorMode.value === 'light'
                ? (colorMode.preference = 'dark')
                : (colorMode.preference = 'light')
            "
            title="RSS Feed" />
        </ColorScheme>
      </div>
      <div>
        <p class="text-ui-text-dimmed text-xs">
          &copy; {{ new Date().getFullYear() }} getmuslim. All rights reserved.
        </p>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode();
</script>
