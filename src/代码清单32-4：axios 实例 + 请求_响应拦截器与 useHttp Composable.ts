// src/utils/http.ts
import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import { useUserStore } from '@/stores/user'

// 用环境变量驱动 baseURL：dev 是 /api（走 Vite 代理），prod 是真实域名
// 缺省回退到 '/api'：防止 .env 配置遗漏时整站崩溃
const baseURL = import.meta.env.VITE_API_BASE ?? '/api'

const instance: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器：注入 Token
// 在函数体内而非模块顶部调 useUserStore：避免 http.ts 与 stores/user.ts 的循环依赖
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const userStore = useUserStore()
    if (userStore.token) {
      // JWT 标准格式是 Bearer + 空格 + token，后端按这个前缀识别认证方案
      config.headers.set('Authorization', `Bearer ${userStore.token}`)
    }
    return config
  },
  (error: unknown) => Promise.reject(error)
)

// 统一提示错误的内部函数
// 这里用 console.error 兜底；接入 Element Plus 时换成 ElMessage.error(message)
// 接入其他 UI 库同理，调用点集中在此函数内即可
function notifyError(message: string): void {
  console.error(`[request error] ${message}`)
}

// 响应拦截器：成功剥壳、失败按状态码分流
instance.interceptors.response.use(
  (response) => {
    // 业务代码无需再写 .data：拦截器统一剥壳，调用方拿到的就是后端返回的 body
    return response.data
  },
  async (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status
    // 后端约定的业务错误消息，缺省时退到 axios 原始 message
    const message = error.response?.data?.message ?? error.message

    if (status === 401) {
      // 401 表示 token 失效或过期：清登录态并跳登录页
      // 动态 import router：避免 router.ts 与 http.ts 的模块加载循环
      const { default: router } = await import('@/router')
      useUserStore().logout()
      // 用 replace 而非 push：登录过期跳转后用户按返回键不应再回到失效页面
      router.replace({ name: 'login' })
      notifyError('登录已过期，请重新登录')
    } else if (status !== undefined && status >= 500) {
      notifyError('服务器繁忙，请稍后再试')
    } else if (status !== undefined && status >= 400) {
      notifyError(message)
    } else {
      // 网络错误、超时等无 response 的情况
      notifyError('网络异常，请检查连接')
    }

    return Promise.reject(error)
  }
)

// 同时提供具名与默认导出：调用方按团队偏好二选一
export const http = instance
export default instance