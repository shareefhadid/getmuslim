import { z } from "zod";
import type { PostingDetails } from "~/types/postings";

export enum PostingMode {
  Recent = "recent",
  Nearby = "nearby",
}

export interface PostingsParams {
  mode: PostingMode;
  lat?: number;
  long?: number;
  category?: number;
  page?: number;
  pageSize?: number;
  maxDistance?: number;
}

const PostingsParamsSchema = z
  .object({
    mode: z.nativeEnum(PostingMode),
    lat: z.number().min(-90).max(90).optional(),
    long: z.number().min(-180).max(180).optional(),
    category: z.number().optional(),
    page: z.number().min(1).default(1),
    pageSize: z.number().min(1).max(100).default(1),
    maxDistance: z.number().min(0).optional(),
  })
  .refine(
    (data) => {
      if (data.mode === PostingMode.Nearby) {
        return data.lat != null && data.long != null;
      }
      return true;
    },
    {
      message: "Latitude and longitude are required for nearby mode",
    },
  );

export const usePostings = (params: Ref<PostingsParams>) => {
  const parsedParams = computed(() =>
    PostingsParamsSchema.safeParse(params.value),
  );

  const validParams = computed(() =>
    parsedParams.value.success ? parsedParams.value.data : null,
  );

  const {
    data: response,
    status,
    error,
  } = useAsyncData(
    "postings",
    async () => {
      if (!validParams.value) {
        throw new Error(
          parsedParams.value.success
            ? "Invalid params"
            : parsedParams.value.error.message,
        );
      }

      return $fetch<{ data: PostingDetails[]; total: number }>(
        "/api/postings",
        {
          params: {
            ...validParams.value,
            limit: validParams.value.pageSize,
            offset: (validParams.value.page - 1) * validParams.value.pageSize,
          },
          headers: useRequestHeaders(["cookie"]),
        },
      );
    },
    {
      watch: [params],
      default: () => ({ data: [], total: 0 }),
    },
  );

  return {
    postings: computed(() => response.value?.data ?? []),
    isLoading: computed(() => status.value === "pending"),
    error,
    pagination: computed(() => {
      const page = validParams.value?.page ?? 1;
      const pageSize = validParams.value?.pageSize ?? 10;
      const total = response.value?.total ?? 0;
      const totalPages = Math.ceil(total / pageSize);

      return {
        currentPage: page,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };
    }),
  };
};
