// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    // 整站预渲染为静态 HTML（构建时执行 nuxt generate）
    '/**': { prerender: true },
  },
})