export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("feed:generate", async ({ feed, options }) => {
    const config = useRuntimeConfig();
    const siteUrl = config.public.siteUrl;
    const postings = await $fetch("/api/feed-data");

    feed.options = {
      title: "getmuslim",
      description: "Latest postings",
      id: siteUrl,
      link: siteUrl,
      language: "en",
      favicon: `${siteUrl}/favicon.ico`,
      copyright: `Copyright ${new Date().getFullYear()} getmuslim. All rights reserved.`,
    };

    postings?.forEach((posting) => {
      feed.addItem({
        title: posting.title,
        id: `${siteUrl}/postings/${posting.id}`,
        link: `${siteUrl}/postings/${posting.id}`,
        description: posting.description,
        content: posting.description,
        image: posting.featured_image ?? undefined,
        date: new Date(posting.updated_at ?? posting.created_at),
      });
    });

    feed.addCategory("Postings");
  });
});
