<template>
  <UModal
    title="Find nearby businesses"
    :ui="{
      header: 'pt-4 pb-2',
      footer: 'justify-end',
      content: 'divide-y-0',
      description: 'mt-2',
      body: 'pt-2 sm:pt-2',
    }"
    :close="{
      color: 'neutral',
      variant: 'subtle',
      class: 'hover:cursor-pointer',
    }">
    <template #description>
      Enter your city to find businesses near you.
    </template>
    <template #body>
      <UInputMenu
        class="w-full"
        v-model:search-term="searchText"
        :ui="{
          base: 'focus-visible:ring-ui-border-accented',
        }"
        placeholder="Enter your city"
        autofocus
        trailing-icon=""
        :items="items">
        <template #empty>{{ emptyText }}</template>
      </UInputMenu>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
const modal = useModal();

const emit = defineEmits<{
  "location-set": [];
}>();

const emptyText = computed(() =>
  searchText.value.length < 3
    ? "Type 3 or more letters to searching"
    : "Searching...",
);

const searchText = ref("");
const selectedSuggestion = ref<any>(null);

const { suggestions } = useSearchLocation(searchText);

useRetrieveLocation(selectedSuggestion);

const items = computed(() => {
  return suggestions.value.map((suggestion, index) => {
    return {
      label: `${suggestion.name}, ${suggestion.place_formatted}`,
      onSelect: (e: Event) => {
        if (suggestion) {
          selectedSuggestion.value = suggestion;
          emit("location-set");
          modal.close();
          setTimeout(() => (searchText.value = ""), 500);
        }
      },
    };
  });
});
</script>
