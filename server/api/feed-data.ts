import { serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/types/database.types'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event);
  
  const { data: postings } = await client
    .from("postings")
    .select("id, title, description, featured_image, updated_at, created_at")
    .eq("status", "active")
    .order("created_at", { ascending: false });
    
  return postings;
}); 