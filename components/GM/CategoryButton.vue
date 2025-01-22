<template>
  <UButton
    class="hover:cursor-pointer"
    :variant="mode === 'badge' ? 'subtle' : isActive ? 'solid' : 'outline'"
    size="xs"
    :icon="icon"
    :color="mode === 'badge' ? undefined : 'neutral'"
    @click.prevent="handleClick"
    :ui="{
      base:
        mode !== 'badge' && !isActive
          ? 'bg-ui-bg-elevated hover:bg-ui-bg-accented/75'
          : '',
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
const router = useRouter();

const selectedCategory = computed(() => route.query.category);

const handleClick = async () => {
  if (categoryId && selectedCategory.value !== categoryId) {
    await router.replace({
      query: {
        ...route.query,
        category: categoryId,
        page: undefined,
      },
    });
  } else if (mode === "filter") {
    await router.replace({
      query: {
        ...route.query,
        category: undefined,
        page: undefined,
      },
    });
  }
};

const isActive = computed(() => {
  return selectedCategory.value === categoryId;
});
</script>
