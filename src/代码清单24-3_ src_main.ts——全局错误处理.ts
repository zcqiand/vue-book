import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())

// 全局错误处理：所有未被 onErrorCaptured/Suspense 拦截的错误最终到达这里
app.config.errorHandler = (err, instance, info) => {
  // 将错误上报到监控服务（如 Sentry）
  console.error('全局未捕获错误:', err)
  console.error('错误组件实例:', instance)
  console.error('错误信息:', info)

  // 实际项目中：
  // reportError({ err, info, url: window.location.href, userId: getUserId() })
}

// 可选：Vue 警告处理（生产环境可关闭）
app.config.warnHandler = (msg, instance, trace) => {
  if (process.env.NODE_ENV === 'production') return
  console.warn('Vue 警告:', msg, trace)
}

app.mount('#app')