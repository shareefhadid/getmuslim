<template>
	<div
			 class="px-3 py-1 transition-all duration-300 rounded-full shadow-sm hover:bg-ui-bg-elevated hover:shadow hover:cursor-pointer ring ring-ui-border">
		<div class="flex items-center text-sm gap-x-1">
			<Icon v-if="icon" :name="icon" size="1.4em" class="text-ui-primary" />
			<p class="font-medium whitespace-nowrap">{{ label }}</p>
		</div>
	</div>
</template>

<script lang="ts" setup>
const { icon, label } = defineProps<{
	icon?: string;
	label: string;
}>();
</script>