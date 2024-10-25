import type { Categories } from "~/types/supabase";

export const useCategories = () => {
  const categories = ref<Categories[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchCategories = async () => {
    loading.value = true;
    error.value = null;

    try {
      categories.value = await $fetch("/api/categories");
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to fetch categories";
      console.error("Error fetching categories:", err);
    } finally {
      loading.value = false;
    }
  };

  return {
    categories,
    loading,
    error,
    fetchCategories,
  };
};
