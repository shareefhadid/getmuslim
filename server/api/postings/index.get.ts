import { serverSupabaseClient } from "#supabase/server";
import { z } from "zod";
import { Database } from "~/types/database.types";

export default defineEventHandler(async (event) => {
  try {
    const locationCookie = getCookie(event, "location");
    const { lat: cookieLat, long: cookieLong } = locationCookie
      ? JSON.parse(locationCookie)
      : {};

    const { mode, ...queryParams } = await getValidatedQuery(event, (query) => {
      return z
        .object({
          mode: z.enum(["nearby", "recent"]),
          lat: z.coerce.number().min(-90).max(90).optional().default(cookieLat),
          long: z.coerce
            .number()
            .min(-180)
            .max(180)
            .optional()
            .default(cookieLong),
          category: z.coerce.number().optional(),
          page: z.coerce.number().min(1).default(1),
          pageSize: z.coerce.number().min(1).max(100).default(8),
          maxDistance: z.coerce.number().min(0).optional(),
        })
        .transform(({ page, pageSize, maxDistance, ...rest }) => ({
          ...rest,
          limit_count: pageSize,
          offset_count: (page - 1) * pageSize,
          max_distance: maxDistance,
        }))
        .parse(query);
    });

    const client = await serverSupabaseClient<Database>(event);

    const functionName =
      mode === "nearby" ? "get_nearby_postings_v2" : "get_recent_postings_v2";

    const { data, error } = await client.rpc(functionName, queryParams);

    if (error) {
      logError(getRequestURL(event).pathname, error);
      throw createError({ statusCode: 400, message: error.message });
    }

    return { data: data[0].rows, total: data[0].total };
  } catch (error) {
    handleServerError(event, error);
  }
});
