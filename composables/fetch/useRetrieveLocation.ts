import mapbox from "@mapbox/search-js-core";

export const useRetrieveLocation = async (
  selectedSuggestion: Ref<mapbox.SearchBoxSuggestion | null>,
) => {
  const { data, status, error, refresh } = await useFetch(
    "/api/retrieve-location",
    {
      method: "POST",
      body: { suggestion: selectedSuggestion },
      headers: useRequestHeaders(["cookie"]),
      immediate: false,
    },
  );

  watchEffect(() => {
    if (selectedSuggestion.value) {
      refresh();
    }
  });

  return {
    feature: computed(() => data.value?.feature ?? null),
    isLoading: computed(() => status.value === "pending"),
    error,
  };
};
