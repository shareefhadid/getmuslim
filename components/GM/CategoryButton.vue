<template>
	<UButton :variant="isActive ? 'solid' : 'outline'" size="xs" :icon="icon" color="neutral" @click="handleClick"
					 class="hover:cursor-pointer">
		{{ label }}
	</UButton>
</template>

<script lang="ts" setup>
const { icon, label, id } = defineProps<{
	icon?: string;
	label: string;
	id?: string | null;
}>();

const router = useRouter();
const route = useRoute();

const selectedCategory = computed(() => route.query.category);

const handleClick = async () => {
	if (id && selectedCategory.value !== id) {
		await navigateTo({ query: { category: id }, replace: true });
	} else {
		await navigateTo({ query: {}, replace: true })
	}
};

const isActive = computed(() => {
	return selectedCategory.value === id;
});
</script>