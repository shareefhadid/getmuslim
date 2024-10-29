export const usePostings = () => {
  const {
    data: response,
    error,
    status,
  } = useAsyncData(() => $fetch("/api/postings"));

  const postings = computed(() => response.value?.data || []);

  return {
    postings,
    status,
    error,
  };
};
