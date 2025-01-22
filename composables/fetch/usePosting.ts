import { z } from "zod";
import type { PostingDetails } from "~/types/postings";

interface PostingParams {
  id: number;
  lat?: number;
  long?: number;
}

const PostingParamsSchema = z
  .object({
    id: z.number().positive(),
    lat: z.number().min(-90).max(90).optional(),
    long: z.number().min(-180).max(180).optional(),
  })
  .refine(
    (data) => {
      if (data.lat != null || data.long != null) {
        return data.lat != null && data.long != null;
      }
      return true;
    },
    {
      message:
        "Both latitude and longitude must be provided if either is present",
    },
  );

export const usePosting = (params: Ref<PostingParams>) => {
  const parsedParams = computed(() =>
    PostingParamsSchema.safeParse(params.value),
  );

  const validParams = computed(() =>
    parsedParams.value.success ? parsedParams.value.data : null,
  );

  const {
    data: response,
    status,
    error,
  } = useAsyncData(
    `posting-${params.value.id}`,
    async () => {
      if (!validParams.value) {
        throw new Error(
          parsedParams.value.success
            ? "Invalid params"
            : parsedParams.value.error.message,
        );
      }

      return $fetch<{ data: PostingDetails }>(
        `/api/postings/${validParams.value.id}`,
        {
          params: {
            lat: validParams.value.lat,
            long: validParams.value.long,
          },
          headers: useRequestHeaders(["cookie"]),
        },
      );
    },
    {
      watch: [params],
    },
  );

  return {
    posting: computed(() => response.value?.data),
    isLoading: computed(() => status.value === "pending"),
    error,
  };
};
