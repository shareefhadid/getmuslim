import { serverSupabaseClient } from "#supabase/server";
import { z } from "zod";
import type { Database } from "~/types/database.types";

export default eventHandler(async (event) => {
  try {
    const query = await getValidatedQuery(event, (data) =>
      z
        .object({
          searchText: z.string(),
        })
        .parse(data),
    );

    const client = await serverSupabaseClient<Database>(event);

    const { data, error } = await client.rpc("search_content", {
      search_query: query.searchText,
    });

    if (error) {
      throw createError({ statusCode: 400, message: error.message });
    }

    return { data };
  } catch (error) {
    handleServerError(event, error);
  }
});
