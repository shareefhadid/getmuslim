import { serverSupabaseClient } from "#supabase/server";
import { Database } from "~/types/database.types";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event);

  return await client.from("postings").select("*");
});
