import type { Tables } from "~/types/database.types";
import type { Category } from "~/types/supabase";

interface SearchResults {
  categories: Pick<Category, "id" | "label" | "icon">[];
  postings: Pick<
    Tables<"postings">,
    "id" | "title" | "description" | "featured_image" | "address"
  >[];
}

export const useSearch = (searchText: Ref<string>) => {
  const debouncedSearchText = refDebounced(searchText, 750);

  const { data, status, error, refresh } = useFetch<{ data: SearchResults }>(
    "/api/search",
    {
      query: { searchText: debouncedSearchText },
      immediate: false,
      watch: false,
    },
  );

  watchEffect(() => {
    if ((debouncedSearchText.value?.length ?? 0) >= 3) {
      refresh();
    }
  });

  return {
    categories: computed(() => data.value?.data.categories ?? []),
    postings: computed(() => data.value?.data.postings ?? []),
    isLoading: computed(() => status.value === "pending"),
    debouncing: computed(() => debouncedSearchText.value !== searchText.value),
    error,
  };
};
