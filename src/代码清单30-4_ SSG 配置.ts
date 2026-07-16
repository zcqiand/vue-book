// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    // 整站预渲染为静态 HTML
    '/**': { prerender: true },
  },
})