import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// createApp 返回一个全新的应用实例：插件、全局组件、错误处理都挂在它身上
// 同一页面可以创建多个互不干扰的 app 实例（微前端场景必需）
const app = createApp(App)

// app.use 链式注册插件：顺序无强约束，但 Pinia 通常先于 Router 注册
// 因为路由守卫里可能用到 store（如登录态判断）
app.use(createPinia())
app.use(router)

// 集中捕获组件渲染与侦听器抛出的未处理错误：避免整页白屏且无任何日志
// Vue 2 也支持 errorHandler，但写在 new Vue 之前，迁移时常被遗漏
app.config.errorHandler = (err, _instance, info) => {
  console.error('[global error]', err, info)
}

app.mount('#app')