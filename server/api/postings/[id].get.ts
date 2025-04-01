import { serverSupabaseClient } from "#supabase/server";
import { z } from "zod";
import { Database } from "~/types/database.types";

export default defineEventHandler(async (event) => {
  try {
    const locationCookie = getCookie(event, "location");
    const { lat, long } = locationCookie ? JSON.parse(locationCookie) : {};

    const query = await getValidatedQuery(event, (data) =>
      z
        .object({
          lat: z
            .string()
            .optional()
            .transform((val) => parseFloatParam(val) ?? lat),
          long: z
            .string()
            .optional()
            .transform((val) => parseFloatParam(val) ?? long),
        })
        .parse(data),
    );

    const { id: posting_id } = await getValidatedRouterParams(event, (params) =>
      z
        .object({
          id: z.string().transform((val) => parseInt(val)),
        })
        .parse(params),
    );

    const client = await serverSupabaseClient<Database>(event);

    const { data, error } = await client.rpc("get_posting_v2", {
      posting_id,
      ...query,
    });

    if (error) {
      logError(getRequestURL(event).pathname, error);
      throw createError({ statusCode: 400, message: error.message });
    }

    return { data: data[0] ?? null };
  } catch (error) {
    handleServerError(event, error);
  }
});
