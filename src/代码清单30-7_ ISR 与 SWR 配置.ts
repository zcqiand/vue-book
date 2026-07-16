// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    // 营销页：缓存 1 小时，到期后下次请求时后台重新生成
    '/marketing/**': { isr: 3600 },

    // 商品详情：缓存 60 秒，期间用旧内容，到期后台异步刷新
    '/products/**': { swr: 60 },

    // 个性化页：完全禁用缓存，每个请求都 SSR
    '/user/**': { ssr: true, cache: false },
  },
})