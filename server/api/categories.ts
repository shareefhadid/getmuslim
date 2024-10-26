import { serverSupabaseClient } from "#supabase/server";
import { H3Error, H3Event } from "h3";
import { z } from "zod";
import { Database } from "~/types/database.types";

const QueryParamsSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => {
      const num = Number(val);
      return isNaN(num) || num < 1 ? 1 : num;
    }),
  limit: z
    .string()
    .optional()
    .transform((val) => {
      const num = Number(val);
      return isNaN(num) || num < 1 ? 20 : Math.min(num, 100);
    }),
  search: z
    .string()
    .optional()
    .transform((val) => val?.trim() || undefined),
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

export default defineEventHandler(async (event: H3Event) => {
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

    const { page, limit, search, parentId } = result.data;

    const client = await serverSupabaseClient<Database>(event);

    let categoriesQuery = client
      .from("categories")
      .select("*", { count: "exact" });

    if (parentId === null) {
      categoriesQuery = categoriesQuery.is("parent_id", parentId);
    } else if (parentId !== undefined) {
      categoriesQuery = categoriesQuery.eq("parent_id", parentId);
    }

    if (search) {
      categoriesQuery = categoriesQuery.ilike("label", `%${search}%`);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await categoriesQuery
      .range(from, to)
      .order("label");

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message,
      });
    }

    return {
      data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: count ? Math.ceil(count / limit) : 0,
      },
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
