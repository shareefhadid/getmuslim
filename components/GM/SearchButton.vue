<template>
  <UButton
    class="xs:self-center w-3xs self-start bg-white font-normal text-zinc-500 shadow-sm ring-1 ring-zinc-300 transition-all ease-in-out hover:cursor-pointer hover:bg-zinc-50 hover:shadow-md"
    icon="mdi:magnify"
    @click="openSearch">
    Search...
    <template #trailing>
      <div class="max-xs:hidden flex grow justify-end gap-1">
        <UKbd
          class="text-ui-bg bg-transparent text-zinc-600 ring-zinc-400"
          value="meta" />
        <UKbd
          class="text-ui-bg bg-transparent text-zinc-600 ring-zinc-400"
          value="k" />
      </div>
    </template>
  </UButton>
</template>

<script lang="ts" setup>
import { GMSearchPalette } from "#components";

const overlay = useOverlay();
const modal = overlay.create(GMSearchPalette);

const openSearch = () => {
  document.activeElement instanceof HTMLElement &&
    document.activeElement.blur();
  modal.open();
};

defineShortcuts({
  meta_k: () => {
    openSearch();
  },
});
</script>
