import { useRoute, useRouter } from "vue-router";

export const useCategories = () => {
  const route = useRoute();
  const router = useRouter();

  const search = ref("");
  const parentId = ref<number | null>(null);
  const limit = ref<number | null>(null);

  const page = computed(() => Number(route.query.page) || 1);

  const cacheKey = computed(() => ({
    page: page.value,
    search: search.value,
    parentId: parentId.value,
    limit: limit.value,
  }));

  const {
    data: response,
    error,
    status,
    refresh,
  } = useAsyncData(
    "categories",
    () =>
      $fetch("/api/categories", {
        query: {
          page: page.value,
          limit: limit.value,
          search: search.value || undefined,
          parentId: parentId.value,
        },
      }),
    {
      watch: [cacheKey],
    }
  );

  const categories = computed(() => response.value?.data || []);
  const pagination = computed(
    () =>
      response.value?.pagination || {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      }
  );

  const goToPage = async (newPage: number) => {
    await router.push({
      query: {
        ...route.query,
        page: newPage,
      },
    });
  };

  const debouncedSearch = useDebounceFn(async (value: string) => {
    search.value = value;
    // Reset to first page when searching
    if (page.value !== 1) {
      await goToPage(1);
    }
  }, 300);

  const filterByParent = async (id: number | null) => {
    parentId.value = id;
    if (page.value !== 1) {
      await goToPage(1);
    }
  };

  const updateLimit = async (newLimit: number) => {
    limit.value = newLimit;
    if (page.value !== 1) {
      await goToPage(1);
    }
  };

  const refreshCategories = async (resetFilters = false) => {
    if (resetFilters) {
      search.value = "";
      parentId.value = null;
      limit.value = 10;
      await goToPage(1);
    }
    await refresh();
  };

  return {
    categories,
    status,
    error,
    search,
    parentId,
    pagination,
    limit,
    goToPage,
    debouncedSearch,
    filterByParent,
    updateLimit,
    refreshCategories,
  };
};
