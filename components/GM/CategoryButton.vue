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
            : 'bg-ui-bg-elevated hover:bg-ui-bg-accented',
    }">
    {{ label }}
  </UButton>
</template>

<script lang="ts" setup>
const {
  icon,
  label,
  categoryId,
  mode = "filter",
} = defineProps<{
  icon?: string;
  label: string;
  categoryId?: string | null;
  mode?: "filter" | "badge";
}>();

const route = useRoute();

const selectedCategory = computed(() => route.query.category);

const handleClick = async () => {
  if (categoryId && selectedCategory.value !== categoryId) {
    await navigateTo({ query: { category: categoryId }, replace: true });
  } else if (mode === "filter") {
    await navigateTo({ query: {}, replace: true });
  }
};

const isActive = computed(() => {
  return selectedCategory.value === categoryId;
});
</script>
