import './assets/main.css'

import { createApp, type ComponentPublicInstance } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

interface VueErrorPayload {
  message: string
  stack: string
  info: string
  componentName: string
  route: string
  time: string
}

const ERROR_REPORT_URL = '/api/client-errors'

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

function getErrorStack(error: unknown): string {
  return error instanceof Error && error.stack ? error.stack : ''
}

function getComponentName(instance: ComponentPublicInstance | null): string {
  const internalType = instance?.$?.type as { name?: string; __name?: string } | undefined
  return instance?.$options.name ?? internalType?.name ?? internalType?.__name ?? 'AnonymousComponent'
}

function getCurrentRoute(): string {
  const currentRoute = router.currentRoute.value.fullPath
  return currentRoute || `${window.location.pathname}${window.location.search}${window.location.hash}`
}

export function reportVueError(payload: VueErrorPayload): void {
  const body = JSON.stringify(payload)

  if (navigator.sendBeacon) {
    const sent = navigator.sendBeacon(ERROR_REPORT_URL, new Blob([body], { type: 'application/json' }))
    if (sent) return
  }

  void fetch(ERROR_REPORT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => {
    // 错误上报本身不能再打断用户流程，否则会形成“错误处理器再次抛错”的连锁故障。
  })
}

const app = createApp(App)

app.config.errorHandler = (error, instance, info) => {
  reportVueError({
    message: getErrorMessage(error),
    stack: getErrorStack(error),
    info,
    componentName: getComponentName(instance),
    route: getCurrentRoute(),
    time: new Date().toISOString(),
  })
}

app.use(router)
app.use(createPinia())
app.mount('#app')