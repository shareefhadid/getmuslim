import { serverSupabaseClient } from "#supabase/server";
import { logError } from "../utils/logger";

const parseNumericParam = (value: unknown) =>
  value ? parseInt(value as string) : undefined;

const parseFloatParam = (value: unknown) =>
  value ? parseFloat(value as string) : undefined;

export default eventHandler(async (event) => {
  const query = getQuery(event);
  const client = await serverSupabaseClient(event);

  const params = {
    lat: parseFloatParam(query.lat),
    long: parseFloatParam(query.long),
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
  return { data, total: data?.length ?? 0 };
});
