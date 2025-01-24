// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  runtimeConfig: {
    mapboxToken: process.env.MAPBOX_ACCESS_TOKEN, // Available only on the server
  },
  modules: ["@nuxt/ui", "@nuxtjs/supabase", "@vueuse/nuxt", "@nuxt/image"],
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
