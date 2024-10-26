export const useCategories = () => {
  const {
    data: response,
    error,
    status,
  } = useAsyncData("allCategories", () =>
    $fetch("/api/categories", {
      query: {
        parentId: "null",
      },
    })
  );

  const categories = computed(() => response.value?.data || []);

  return {
    categories,
    status,
    error,
  };
};
