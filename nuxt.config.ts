// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/ui-pro'],

  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      auth: {
        redirectUserTo: '/app/user',
        redirectGuestTo: '/',
      },
    },
  },

  nitro: {
    experimental: {
      asyncContext: true
    },
    routeRules: {
      '/app/**': {
        ssr: false
      }
    }
  },

  $production: {
    nitro: {
      storage: {
        auth: {
          driver: 'redis',
          url: process.env.REDIS_URL
        }
      }
    }
  },

  $development: {
    nitro: {
      storage: {
        auth: {
          driver: 'memory'
        }
      }
    }
  },

  css: ['~/assets/css/index.css'],

  future: { compatibilityVersion: 4 },

  compatibilityDate: '2025-05-13',
})
