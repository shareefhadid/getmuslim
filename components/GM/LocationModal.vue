<template>
  <UModal
    title="Find nearby businesses"
    description="Allow location permissions to find business near you."
    :ui="{
      footer: 'justify-end pt-2 sm:px-4',
      content: 'divide-y-0',
      description: 'mt-2',
    }"
    :close="{
      color: 'neutral',
      variant: 'subtle',
      class: 'hover:cursor-pointer',
    }">
    <template #description>
      Allow location permissions to find business near you.
    </template>
    <template #footer>
      <UButton
        class="hover:cursor-pointer"
        color="neutral"
        variant="subtle"
        @click="modal.close()">
        Cancel
      </UButton>
      <UButton class="hover:cursor-pointer" color="neutral">Allow</UButton>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
const modal = useModal();
const location = useLocationCookie();
// const emit = defineEmits<{
//   "location-set": [];
// }>();
</script>
