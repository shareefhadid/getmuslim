// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  runtimeConfig: {
    mapboxToken: process.env.MAPBOX_ACCESS_TOKEN, // Available only on the server
    public: {
      siteUrl:
        process.env.NODE_ENV === "production"
          ? "https://getmuslim.com"
          : "http://localhost:3000",
    },
  },
  nitro: {
    experimental: {
      openAPI: true,
    },
    // prerender: {
    //   routes: ["/sitemap.xml"],
    // },
  },
  site: {
    url:
      process.env.NODE_ENV === "production"
        ? "https://getmuslim.com"
        : "http://localhost:3000",
  },
  sitemap: {
    urls: ["/feed.xml"],
    sources: ["/api/__sitemap__/urls"],
    xsl: false,
    autoLastmod: false,
  },
  linkChecker: {
    failOnError: true,
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
  image: {
    provider: "ipx",
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },
  routeRules: {
    "/about": { prerender: true },
    // "/sitemap.xml": { prerender: true },
    // "/feed.xml": { prerender: true },
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
  robots: {
    enabled: true,
    sitemap: ["/sitemap.xml"],
    allow: ["*"],
    disallow: [],
    robotsEnabledValue:
      "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  },
  schemaOrg: {
    identity: {
      type: "Organization",
      name: "getmuslim",
      description: "Find Muslim-owned businesses and organizations",
      logo: "/logo.png",
    },
  },
});
