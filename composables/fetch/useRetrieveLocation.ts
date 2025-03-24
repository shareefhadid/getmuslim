import {
  type SearchBoxFeatureSuggestion,
  type SearchBoxSuggestion,
} from "@mapbox/search-js-core";

export const useRetrieveLocation = async (
  selectedSuggestion: Ref<SearchBoxSuggestion | null>,
  setLocationCookie?: boolean,
) => {
  const { data, status, error, refresh } = await useFetch<{
    feature: SearchBoxFeatureSuggestion;
  }>("/api/retrieve-location", {
    method: "POST",
    body: { suggestion: selectedSuggestion, setLocationCookie },
    headers: useRequestHeaders(["cookie"]),
    immediate: false,
  });

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
