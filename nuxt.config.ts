// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/ui-pro'],

  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      auth: {
        redirectUserTo: '/user',
        redirectGuestTo: '/',
      },
    },
  },

  css: ['~/assets/css/index.css'],

  future: { compatibilityVersion: 4 },

  compatibilityDate: '2025-05-13',
})
