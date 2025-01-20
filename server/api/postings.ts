import { serverSupabaseClient } from "#supabase/server";
import { logError } from "../utils/logger";

const parseNumericParam = (value: unknown) =>
  value ? parseInt(value as string) : undefined;

const parseFloatParam = (value: unknown) =>
  value ? parseFloat(value as string) : undefined;

export default eventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const client = await serverSupabaseClient(event);
    const locationCookie = getCookie(event, "location");

    const { lat, long } = locationCookie ? JSON.parse(locationCookie) : {};

    const params = {
      lat: parseFloatParam(query.lat) ?? lat,
      long: parseFloatParam(query.long) ?? long,
      category: parseNumericParam(query.category),
      limit_count: parseNumericParam(query.limit),
      offset_count: parseNumericParam(query.offset),
      max_distance: parseNumericParam(query.maxDistance),
    };

    const functionName =
      query.mode === "nearby" ? "get_nearby_postings" : "get_recent_postings";

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
