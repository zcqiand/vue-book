// src/utils/httpFetch.ts
import { useUserStore } from '@/stores/user'

// 自定义错误类型：携带 HTTP 状态码与后端业务消息，调用方可按类型分支处理
export class HttpRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly payload?: unknown
  ) {
    super(message)
    this.name = 'HttpRequestError'
  }
}

// fetch 原生没有拦截器，等价逻辑全部内联到这个包装函数里
// 泛型 T 让调用方声明响应体类型，函数内部用 unknown 接住再由调用方断言
export async function request<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  // 等价 axios 请求拦截器：注入 Token
  const userStore = useUserStore()
  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')
  if (userStore.token) {
    headers.set('Authorization', `Bearer ${userStore.token}`)
  }

  // 等价 axios.create 的 baseURL + timeout
  const baseURL = import.meta.env.VITE_API_BASE ?? '/api'
  // 10 秒超时：fetch 原生不支持，用 AbortController 实现
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000)

  let response: Response
  try {
    response = await fetch(`${baseURL}${url}`, {
      ...options,
      headers,
      signal: controller.signal
    })
  } catch (err) {
    clearTimeout(timeoutId)
    // 网络错误或超时统一抛 HttpRequestError，调用方仅需 catch 一种类型
    throw new HttpRequestError(
      err instanceof Error ? err.message : '网络请求失败',
      0
    )
  }
  clearTimeout(timeoutId)

  // 401 等价 axios 响应拦截器：自动登出跳登录
  if (response.status === 401) {
    const { default: router } = await import('@/router')
    useUserStore().logout()
    router.replace({ name: 'login' })
    throw new HttpRequestError('登录已过期，请重新登录', 401)
  }

  // 解析响应体：失败的请求也尝试读 body 拿业务错误消息
  // 用 unknown 接住再断言为 T，避免 TS 误以为 res.json() 返回任意结构都安全
  const payload: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    // 类型守卫：只有 payload 是带 message 字段的对象时才取，避免运行时访问 undefined
    const message =
      payload && typeof payload === 'object' && 'message' in payload
        ? String((payload as { message: unknown }).message)
        : `请求失败：${response.status}`
    throw new HttpRequestError(message, response.status, payload)
  }

  return payload as T
}

// 语义化快捷函数：调用方写 get('/me') 而非 request('/me', {})
export const httpFetch = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, body: unknown) =>
    request<T>(url, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(url: string, body: unknown) =>
    request<T>(url, { method: 'PUT', body: JSON.stringify(body) }),
  del: <T>(url: string) => request<T>(url, { method: 'DELETE' })
}