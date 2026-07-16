// src/utils/http.ts
import axios from 'axios'

// 统一导出 axios 实例：调用方 import { http } from '@/utils/http 即可
// 显式导入比 this.$http 强在：来源、类型、是否可 mock 一目了然
export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE ?? '/api',
  timeout: 10_000
})

// 也可在 http.ts 里加拦截器：token 自动注入、统一错误处理
http.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})