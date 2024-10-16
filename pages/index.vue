<template>
  <div>
    <GMHeroCard />
  </div>
</template>

<script lang="ts" setup>
const { data } = await useFetch("/api/categories", {
  headers: useRequestHeaders(["cookie"]),
});

const categories = data.value?.categories;
</script>