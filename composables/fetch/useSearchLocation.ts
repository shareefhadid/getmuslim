export const useSearchLocation = (searchText: Ref<string>) => {
  const debouncedSearchText = refDebounced(searchText, 1000);

  const { data, status, error, refresh } = useFetch("/api/search-location", {
    query: { searchText: debouncedSearchText },
    immediate: false,
    watch: false,
    headers: useRequestHeaders(["cookie"]),
  });

  watchEffect(() => {
    if ((debouncedSearchText.value?.length ?? 0) >= 3) {
      refresh();
    }
  });

  return {
    suggestions: computed(() => data.value?.suggestions ?? []),
    isLoading: computed(() => status.value === "pending"),
    error,
  };
};
