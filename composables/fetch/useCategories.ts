export const useCategories = async () => {
  const {
    data: response,
    error,
    status,
  } = await useAsyncData(() =>
    $fetch("/api/categories", { headers: useRequestHeaders(["cookie"]) }),
  );

  const categories = computed(() => response.value?.data || []);

  return {
    categories,
    status,
    error,
  };
};
