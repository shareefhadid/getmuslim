export const useSearchLocation = (searchText: Ref<string>, types?: string) => {
  const debouncedSearchText = refDebounced(searchText, 750);

  const { data, status, error, refresh } = useFetch("/api/search-location", {
    query: { searchText: debouncedSearchText, types },
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
    suggestions: computed(() =>
      (searchText.value?.length ?? 0) >= 3
        ? (data.value?.suggestions ?? [])
        : [],
    ),
    isLoading: computed(() => status.value === "pending"),
    debouncing: computed(() => debouncedSearchText.value !== searchText.value),
    status,
    error,
  };
};
