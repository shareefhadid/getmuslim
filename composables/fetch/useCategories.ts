export const useCategories = () => {
  const {
    data: response,
    error,
    status,
  } = useAsyncData(() => $fetch("/api/categories"));

  const categories = computed(() => response.value?.data || []);

  return {
    categories,
    status,
    error,
  };
};
