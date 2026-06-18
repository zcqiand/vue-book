// src/utils/http.ts
import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import { useUserStore } from '@/stores/user'

const baseURL = import.meta.env.VITE_API_BASE ?? '/api'

const instance: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.set('Authorization', `Bearer ${userStore.token}`)
    }
    return config
  },
  (error: unknown) => Promise.reject(error)
)

function notifyError(message: string): void {
  console.error(`[request error] ${message}`)
}

instance.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status
    const message = error.response?.data?.message ?? error.message

    if (status === 401) {
      const { default: router } = await import('@/router')
      useUserStore().logout()
      router.replace({ name: 'login' })
      notifyError('登录已过期，请重新登录')
    } else if (status !== undefined && status >= 500) {
      notifyError('服务器繁忙，请稍后再试')
    } else if (status !== undefined && status >= 400) {
      notifyError(message)
    } else {
      notifyError('网络异常，请检查连接')
    }

    return Promise.reject(error)
  }
)

// 同时提供具名与默认导出：调用方按团队偏好二选一
export const http = instance
export default instance