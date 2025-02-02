// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  runtimeConfig: {
    mapboxToken: process.env.MAPBOX_ACCESS_TOKEN, // Available only on the server
  },
  nitro: {
    experimental: {
      openAPI: true,
    },
  },
  sitemap: {
    urls: ['/feed.xml'],
    sources: ["/api/__sitemap__/urls"],
  },
  modules: [
    "@nuxt/ui",
    "@nuxtjs/supabase",
    "@vueuse/nuxt",
    "@nuxt/image",
    "@nuxthub/core",
    "@nuxtjs/sitemap",
    "nuxt-module-feed",
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
    "/": { prerender: true },
    "/postings/**": { isr: 3600 },
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
});
