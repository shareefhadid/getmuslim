<template>
  <UButton
    class="hover:cursor-pointer"
    :variant="mode === 'badge' ? 'subtle' : isActive ? 'solid' : 'outline'"
    size="xs"
    :icon="icon"
    :color="mode === 'badge' ? undefined : 'neutral'"
    @click.stop="handleClick"
    :ui="{
      base:
        mode === 'badge'
          ? 'hover:bg-ui-primary transition-colors hover:text-white'
          : isActive
            ? ''
            : 'bg-ui-bg-elevated hover:bg-ui-bg',
    }">
    {{ label }}
  </UButton>
</template>

<script lang="ts" setup>
const {
  icon,
  label,
  id,
  mode = "filter",
} = defineProps<{
  icon?: string;
  label: string;
  id?: string | null;
  mode?: "filter" | "badge";
}>();

const route = useRoute();

const selectedCategory = computed(() => route.query.category);

const handleClick = async () => {
  if (id && selectedCategory.value !== id) {
    await navigateTo({ query: { category: id }, replace: true });
  } else if (mode === "filter") {
    await navigateTo({ query: {}, replace: true });
  }
};

const isActive = computed(() => {
  return selectedCategory.value === id;
});
</script>
