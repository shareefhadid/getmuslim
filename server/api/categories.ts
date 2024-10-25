import { serverSupabaseClient } from "#supabase/server";
import { H3Event } from "h3";
import { Database } from "~/types/database.types";

export default defineEventHandler(async (event: H3Event) => {
  try {
    const client = await serverSupabaseClient<Database>(event);
    const { data, error } = await client
      .from("categories")
      .select("*")
      .is("parent_id", null);

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message,
      });
    }

    return data;
  } catch (err) {
    console.error("Categories fetch error:", err);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch categories",
    });
  }
});
