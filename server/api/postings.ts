import { serverSupabaseClient } from "#supabase/server";
import { z } from "zod";
import { Database } from "~/types/database.types";
import { logError } from "../utils/logger";
import { parseFloatParam } from "../utils/parse-float-param";
import { parseNumericParam } from "../utils/parse-numeric-param";

export default eventHandler(async (event) => {
  try {
    const locationCookie = getCookie(event, "location");
    const { lat, long } = locationCookie ? JSON.parse(locationCookie) : {};

    const { mode, ...params } = await getValidatedQuery(event, (data) =>
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
          category: z
            .string()
            .optional()
            .transform((val) => (val ? parseNumericParam(val) : undefined)),
          limit_count: z
            .string()
            .optional()
            .transform((val) => (val ? parseNumericParam(val) : undefined)),
          offset_count: z
            .string()
            .optional()
            .transform((val) => (val ? parseNumericParam(val) : undefined)),
          max_distance: z
            .string()
            .optional()
            .transform((val) => (val ? parseNumericParam(val) : undefined)),
          mode: z.enum(["nearby", "recent"]).optional(),
        })
        .parse(data),
    );

    const client = await serverSupabaseClient<Database>(event);

    const functionName =
      mode === "nearby" ? "get_nearby_postings" : "get_recent_postings";

    const { data, error } = await client.rpc(functionName, params);

    if (error) {
      logError(getRequestURL(event).pathname, error);
      throw createError({ statusCode: 400, message: error.message });
    }

    return { data: data?.rows, total: data?.count ?? 0 };
  } catch (error) {
    handleServerError(event, error);
  }
});
