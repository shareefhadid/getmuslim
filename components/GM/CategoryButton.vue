<template>
	<UButton variant="outline" size="xs" :icon="icon" color="neutral">{{ label }}</UButton>
</template>

<script lang="ts" setup>
const { icon, label } = defineProps<{
	icon?: string;
	label: string;
}>();
</script>