// src/main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// 全局错误处理器：所有未被组件级拦截的错误最终都会到这里
// 这是最后一道防线，适合统一上报日志服务（如 Sentry、Bugsnag）
app.config.errorHandler = (
  err: unknown,          // 错误对象（可能是 Error 或其他类型）
  instance: object | null,  // 抛出错误的组件实例
  info: string           // 额外信息，如 'setup function' / 'render function' / 'watch callback'
) => {
  // 打印到控制台（开发调试）
  console.error('[全局错误]', err)
  console.error('组件:', instance)
  console.error('来源:', info)

  // 上报到日志服务（生产环境）
  // reportError({ err, instance, info, timestamp: Date.now() })
}

// 警告处理器：处理 Vue 发出的警告（不影响应用运行，但可能暗示潜在问题）
app.config.warnHandler = (
  msg: string,
  instance: object | null,
  trace: string
) => {
  // 可将警告记录下来，用于排查潜在问题
  console.warn('[Vue 警告]', msg, trace)
}

app.mount('#app')