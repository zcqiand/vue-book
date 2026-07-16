import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

interface ErrorReport {
  message: string
  stack: string
  info: string
  url: string
  timestamp: number
}

function reportError(payload: ErrorReport): void {
  // 实际项目中应通过 fetch / SDK 上报到监控平台（如 Sentry / 自建日志服务）
  console.error('[ErrorReport]', payload)
  const KEY = 'vue-error-log'
  const history: ErrorReport[] = JSON.parse(localStorage.getItem(KEY) ?? '[]')
  history.push(payload)
  // 仅保留最近 20 条，避免 localStorage 撑爆
  const trimmed = history.slice(-20)
  localStorage.setItem(KEY, JSON.stringify(trimmed))
}

const app = createApp(App)
app.use(createPinia())

// 全局错误处理：所有未被 onErrorCaptured/Suspense 拦截的错误最终到达这里
app.config.errorHandler = (err, _instance, info) => {
  reportError({
    message: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? (err.stack ?? '') : '',
    info,
    url: window.location.href,
    timestamp: Date.now(),
  })
}

// 可选：监听未处理的 Promise 错误（errorHandler 不会自动捕获）
window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason
  reportError({
    message: reason instanceof Error ? reason.message : String(reason),
    stack: reason instanceof Error ? (reason.stack ?? '') : '',
    info: 'unhandledrejection',
    url: window.location.href,
    timestamp: Date.now(),
  })
})

// 可选：Vue 警告处理（生产环境可关闭）
app.config.warnHandler = (msg, _instance, trace) => {
  if (import.meta.env.PROD) return
  console.warn('Vue 警告:', msg, trace)
}

app.mount('#app')