<template>
  <UModal
    :close="{
      color: 'neutral',
      size: 'xs',
      class: 'hover:cursor-pointer',
    }"
    :ui="{ description: 'hidden', wrapper: 'grow' }">
    <template #title>Find nearby businesses</template>
    <template #description>Find nearby businesses</template>

    <template #body>
      <p class="text-ui-accented mb-3 text-sm">
        Enter your address or city to find businesses near you.
      </p>
      <UInputMenu
        class="w-full"
        v-model:search-term="searchText"
        :ui="{
          base: 'focus-visible:ring-ui-border-accented',
        }"
        placeholder="Enter your address or city"
        autofocus
        trailing-icon=""
        :items="items">
        <template #empty>{{ emptyText }}</template>
      </UInputMenu>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
const emit = defineEmits<{
  "location-set": [];
  close: [];
}>();

function handleClose() {
  emit("close");
}
const searchText = ref("");
const selectedSuggestion = ref<any>(null);

const { suggestions, status, debouncing } = useSearchLocation(
  searchText,
  "place,address",
);

const emptyText = computed(() => {
  if (searchText.value.length < 3) {
    return "Type 3 or more letters to searching";
  } else if (status.value === "success" && !debouncing.value) {
    return "No results";
  } else {
    return "Searching...";
  }
});

await useRetrieveLocation(selectedSuggestion, true);

const items = computed(() => {
  return suggestions.value.map((suggestion, index) => {
    return {
      label: `${suggestion.name}, ${suggestion.place_formatted}`,
      onSelect: (e: Event) => {
        if (suggestion) {
          selectedSuggestion.value = suggestion;
          emit("location-set");
          handleClose();
          setTimeout(() => (searchText.value = ""), 500);
        }
      },
    };
  });
});
</script>
