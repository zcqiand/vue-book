// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    '/about': { prerender: true },
  },
})