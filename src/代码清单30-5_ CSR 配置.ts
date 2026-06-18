// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    // 仪表盘路由禁用 SSR，纯客户端渲染
    '/dashboard/**': { ssr: false },
  },
})