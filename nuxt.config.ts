const siteUrl =
  process.env.NODE_ENV === "production"
    ? "https://getmuslim.com"
    : "http://localhost:3000";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  runtimeConfig: {
    mapboxToken: process.env.MAPBOX_ACCESS_TOKEN,
    public: { siteUrl },
  },
  nitro: {
    experimental: {
      openAPI: true,
    },
  },
  routeRules: {
    "/about": { prerender: true },
  },
  modules: [
    "@nuxt/ui",
    "@nuxtjs/supabase",
    "@vueuse/nuxt",
    "@nuxt/image",
    "@nuxthub/core",
    "@nuxtjs/sitemap",
    "nuxt-module-feed",
    "@nuxtjs/robots",
    "nuxt-schema-org",
    "nuxt-link-checker",
  ],
  ui: {
    colorMode: false,
  },
  supabase: {
    redirect: false,
    redirectOptions: {
      login: "/login",
      callback: "/confirm",
      include: [],
      exclude: [],
      cookieRedirect: false,
    },
  },
  site: {
    url: siteUrl,
  },
  feed: {
    sources: [
      {
        path: "/feed.xml",
        type: "rss2",
        cacheTime: 60 * 15,
      },
    ],
  },
  sitemap: {
    urls: ["/feed.xml"],
    sources: ["/api/__sitemap__/urls"],
  },
  robots: {
    sitemap: ["/sitemap.xml"],
    allow: ["*"],
  },
  schemaOrg: {
    identity: {
      type: "Organization",
      name: "getmuslim",
      description: "Find Muslim-owned businesses and organizations",
      logo: "/logo.png",
    },
  },
  image: {
    provider: "ipx",
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
    linkChecker: {
      failOnError: true,
    },
  },
});
