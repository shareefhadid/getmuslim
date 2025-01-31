<template>
  <UButton
    class="hover:cursor-pointer"
    :variant="mode === 'badge' ? 'subtle' : isActive ? 'solid' : 'outline'"
    size="xs"
    :icon="icon"
    :color="mode === 'badge' ? undefined : 'neutral'"
    @click.prevent.stop="handleClick"
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
  setRoute = true,
  onPress,
} = defineProps<{
  icon?: string;
  label: string;
  setRoute?: boolean;
  categoryId?: string | null;
  mode?: "filter" | "badge";
  onPress?: (id: string) => void;
}>();

const route = useRoute();
const router = useRouter();

const selectedCategory = computed(() => route.query.category);
const isActive = computed(() => selectedCategory.value === categoryId);

const handleClick = async () => {
  if (onPress && categoryId) {
    onPress(categoryId);
  }

  if (!setRoute) return;

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
</script>
