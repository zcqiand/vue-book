// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    // 某个路由禁用 SSR，纯客户端渲染
    '/dashboard/**': { ssr: false },
  },
})