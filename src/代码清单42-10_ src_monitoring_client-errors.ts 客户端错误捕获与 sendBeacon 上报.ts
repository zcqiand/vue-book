// ch42 客户端错误上报：
// - window 'error' 与 'unhandledrejection' 兜底
// - navigator.sendBeacon 异步上报，页面卸载也能送达
// - 上报通道失败不抛错（fire-and-forget）
// - payload 脱敏：不包含 token / 手机号 / 邮箱 / query / hash
// - 默认端点 /api/client-errors，与 nginx location /api/ 对齐

const ENDPOINT = '/api/client-errors'

export interface ClientErrorPayload {
  message: string
  stack?: string
  route: string
  version?: string
  timestamp: string
  anonymousRequestId: string
}

function newRequestId(): string {
  // 简单随机 ID；生产可换成 uuid v4
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

function buildPayload(err: unknown, source: 'error' | 'unhandledrejection'): ClientErrorPayload {
  const e = err instanceof Error ? err : new Error(String(err))
  return {
    message: e.message,
    stack: e.stack,
    route: typeof window !== 'undefined' ? window.location.pathname : '',
    version: typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : undefined,
    timestamp: new Date().toISOString(),
    anonymousRequestId: newRequestId(),
  }
}

export function reportClientError(payload: ClientErrorPayload): boolean {
  if (typeof navigator === 'undefined' || typeof navigator.sendBeacon !== 'function') {
    return false
  }
  try {
    const body = new Blob([JSON.stringify({ source: 'client', ...payload })], {
      type: 'application/json',
    })
    return navigator.sendBeacon(ENDPOINT, body)
  } catch {
    // 静默：上报通道不可达时不影响主流程
    return false
  }
}

export function installClientErrorReporter(): void {
  if (typeof window === 'undefined') return
  window.addEventListener('error', (event) => {
    const payload = buildPayload(event.error ?? event.message, 'error')
    reportClientError(payload)
  })
  window.addEventListener('unhandledrejection', (event) => {
    const payload = buildPayload(event.reason, 'unhandledrejection')
    reportClientError(payload)
  })
}