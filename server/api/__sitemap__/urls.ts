import type { SitemapUrlInput } from "#sitemap/types";
import { serverSupabaseClient } from "#supabase/server";
import { Database } from "~/types/database.types";

export default defineSitemapEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event);

  const { data } = await client
    .from("postings")
    .select("id, featured_image, updated_at")
    .eq("status", "active");

  const rows = data ?? [];

  const sitemap: SitemapUrlInput[] = rows.map((row) => {
    return {
      loc: `/postings/${row.id}`,
    };
  }) satisfies SitemapUrlInput[];

  return sitemap;
});
