import { serverSupabaseClient } from "#supabase/server";
import { Database } from "~/types/database.types";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event);

  const { data } = await client
    .from("categories")
    .select("*")
    .is("parent_id", null);

  return { categories: data };
});
