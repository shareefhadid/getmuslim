import { serverSupabaseClient } from "#supabase/server";
import { H3Error } from "h3";
import { Database } from "~/types/database.types";

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient<Database>(event);

    const categoriesQuery = client.from("categories").select("*");

    const { data, error } = await categoriesQuery.order("label");

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message,
      });
    }

    return {
      data,
    };
  } catch (err) {
    if (err instanceof H3Error) throw err;

    console.error("Categories fetch error:", err);

    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch categories",
    });
  }
});
