export default defineNuxtConfig({
  devtools: { enabled: true },
  app: {
    head: {
      title: '我的 Nuxt 应用',
      meta: [
        { name: 'description', content: '应用描述' },
      ],
    },
  },
  modules: [],
})