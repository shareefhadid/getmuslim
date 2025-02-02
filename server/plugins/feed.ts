export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("feed:generate", async ({ feed }) => {
    const postings = await $fetch("/api/feed-data");

    feed.options = {
      title: "getmuslim",
      description: "Latest postings",
      id: process.env.NUXT_PUBLIC_SITE_URL!,
      link: process.env.NUXT_PUBLIC_SITE_URL!,
      language: "en",
      favicon: `${process.env.NUXT_PUBLIC_SITE_URL}/favicon.ico`,
      copyright: `© ${new Date().getFullYear()} getmuslim. All rights reserved.`,
    };

    postings?.forEach((posting) => {
      feed.addItem({
        title: posting.title,
        id: `${process.env.NUXT_PUBLIC_SITE_URL}/postings/${posting.id}`,
        link: `${process.env.NUXT_PUBLIC_SITE_URL}/postings/${posting.id}`,
        description: posting.description,
        content: posting.description,
        image: posting.featured_image ?? undefined,
        date: new Date(posting.updated_at ?? posting.created_at),
      });
    });

    feed.addCategory("Postings");
  });
});
