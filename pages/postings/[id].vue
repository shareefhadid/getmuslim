<template>
  <pre>{{ posting }} {{ error }}</pre>
</template>
<script setup lang="ts">
const route = useRoute();
const params = ref({
  id: parseInt(route.params.id as string),
});

const { posting, error } = usePosting(params);
</script>
