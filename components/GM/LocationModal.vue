<template>
  <UModal
    title="Find nearby businesses"
    description="Allow location permissions to find business near you."
    :ui="{ footer: 'justify-end' }">
    <template #footer>
      <UButton
        class="hover:cursor-pointer"
        color="neutral"
        variant="subtle"
        @click="modal.close()">
        Cancel
      </UButton>
      <UButton
        class="hover:cursor-pointer"
        color="neutral"
        @click="requestLocation">
        Allow
      </UButton>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
const modal = useModal();

const requestLocation = () => {};
</script>
