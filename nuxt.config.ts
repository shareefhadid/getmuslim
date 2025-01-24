// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  runtimeConfig: {
    mapboxToken: process.env.MAPBOX_ACCESS_TOKEN, // Available only on the server
  },
  socialShare: {
    baseUrl: "https://www.getmuslim.com",
  },
  modules: [
    "@nuxt/ui",
    "@nuxtjs/supabase",
    "@vueuse/nuxt",
    "@nuxt/image",
    "@stefanobartoletti/nuxt-social-share",
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
});
