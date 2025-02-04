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
      changefreq: "daily" as const,
      priority: 0.8 as const,
      images: row.featured_image ? [{ loc: row.featured_image }] : [],
    };
  }) satisfies SitemapUrlInput[];

  return sitemap;
});
