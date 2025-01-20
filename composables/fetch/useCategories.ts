export const useCategories = () => {
  const {
    data: response,
    error,
    status,
  } = useAsyncData(() =>
    $fetch("/api/categories", { headers: useRequestHeaders(["cookie"]) }),
  );

  const categories = computed(() => response.value?.data || []);

  return {
    categories,
    status,
    error,
  };
};
