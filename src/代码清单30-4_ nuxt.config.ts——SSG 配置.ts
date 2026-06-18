// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    // 整站预渲染为静态 HTML
    '/**': { prerender: true }
    // 或只预渲染特定路径
    // '/blog/**': { prerender: true }
  }
})