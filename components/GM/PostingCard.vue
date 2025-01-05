<template>
  <UCard
    :ui="{
      root: 'bg-ui-bg-elevated group items-stretch text-left transition hover:cursor-pointer hover:shadow-md',
      header: 'overflow-hidden rounded-t-[calc(var(--ui-radius)*2)] p-0!',
    }"
    as="button">
    <template #header>
      <img
        class="aspect-square w-full object-cover object-center ring ring-[var(--ui-border-accented)] transition-transform group-hover:scale-105"
        :src="`https://picsum.photos/seed/${posting.id}/200/300`"
        alt="Random Image" />
    </template>
    <div class="items-between flex flex-col gap-3">
      <div class="grid grid-cols-6 items-baseline gap-x-2">
        <h2 class="col-span-5 text-lg font-semibold">
          {{ posting.title }}
        </h2>
        <p class="text-ui-text-muted text-sm font-light">42km</p>
      </div>
      <p class="text-ui-text-muted line-clamp-3 text-sm">
        {{ posting.description }}
      </p>
    </div>
    <template #footer>
      <div class="flex flex-wrap gap-1">
        <UBadge
          class="hover:bg-ui-primary badge transition-colors hover:cursor-pointer hover:text-white"
          variant="subtle"
          size="sm">
          <UIcon class="me-1" name="mdi:google-play" />
          Apps
        </UBadge>
        <UBadge
          class="hover:bg-ui-primary transition-colors hover:cursor-pointer hover:text-white"
          variant="subtle"
          size="sm">
          <UIcon class="me-1" name="mdi:stethoscope" />
          Health
        </UBadge>
      </div>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
defineProps<{
  posting: {
    id: string | number
    title: string
    description: string
  }
}>()
</script> 