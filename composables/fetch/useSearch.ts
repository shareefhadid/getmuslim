import type { CategoryDetail } from "~/types/postings";
import type { Tables } from "~/types/database.types";

interface SearchResults {
  categories: CategoryDetail[];
  postings: Tables<"postings">[];
}

export const useSearch = (searchText: Ref<string>) => {
  const debouncedSearchText = refDebounced(searchText, 750);

  const { data, status, error, refresh } = useFetch<{ data: SearchResults }>("/api/search", {
    query: { searchText: debouncedSearchText },
    immediate: false,
    watch: false,
  });

  watchEffect(() => {
    if ((debouncedSearchText.value?.length ?? 0) >= 3) {
      refresh();
    }
  });

  return {
    categories: computed(() => data.value?.data.categories ?? []),
    postings: computed(() => data.value?.data.postings ?? []),
    isLoading: computed(() => status.value === "pending"),
    error,
  };
}; 