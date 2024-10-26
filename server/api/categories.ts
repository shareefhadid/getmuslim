import { serverSupabaseClient } from "#supabase/server";
import { H3Error } from "h3";
import { z } from "zod";
import { Database } from "~/types/database.types";

const QueryParamsSchema = z.object({
  parentId: z
    .string()
    .optional()
    .transform((val) => {
      if (val === undefined) return undefined;
      if (val === "null" || val === "") return null;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    }),
});

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const result = QueryParamsSchema.safeParse(query);

    if (!result.success) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid query parameters",
        data: result.error.flatten(),
      });
    }

    const { parentId } = result.data;

    const client = await serverSupabaseClient<Database>(event);

    let categoriesQuery = client.from("categories").select("*");

    if (parentId === null) {
      categoriesQuery = categoriesQuery.is("parent_id", parentId);
    } else if (parentId !== undefined) {
      categoriesQuery = categoriesQuery.eq("parent_id", parentId);
    }

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
