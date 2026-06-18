import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { http } from '@/utils/http'

// 用户领域模型：后端 /api/me 返回的当前用户信息
export interface User {
  id: number
  username: string
  nickname: string
  avatar: string
}

// 登录请求体：与后端 /api/login 接收的 JSON 一一对应
export interface LoginPayload {
  username: string
  password: string
}

// 登录响应体：后端返回 JWT 与当前用户信息
export interface LoginResponse {
  token: string
  user: User
}

// localStorage 的 key 单独定义成常量，避免散落字符串字面量写错
const TOKEN_STORAGE_KEY = 'app_token'

export const useUserStore = defineStore('user', () => {
  // 初始值从 localStorage 读取：刷新页面后 token 不丢，无需重新登录
  // 用 ref 而非 reactive：token 是单一字符串基本值，reactive 不接受基本类型
  const token = ref<string>(localStorage.getItem(TOKEN_STORAGE_KEY) ?? '')

  // 当前用户信息：未登录时为 null，用联合类型显式标注
  const currentUser = ref<User | null>(null)

  // 派生状态：模板里 v-if="userStore.isLoggedIn" 控制导航栏登录按钮显隐
  const isLoggedIn = computed(() => token.value.length > 0)

  // 写入与清除都封装成私有函数，确保 state 与 localStorage 始终同步
  // 任一处漏改都会导致「前端显示已登录但后端拒绝」「刷新后登录态丢失」之类脏状态
  function persistToken(value: string): void {
    token.value = value
    if (value) {
      localStorage.setItem(TOKEN_STORAGE_KEY, value)
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY)
    }
  }

  // 登录 action：异步调用后端、持久化 token、拉取用户信息
  async function login(payload: LoginPayload): Promise<void> {
    // http 是带拦截器的 axios 实例，登录成功拦截器返回 response.data，类型为 LoginResponse
    const data = await http.post<LoginResponse>('/login', payload)
    persistToken(data.token)
    currentUser.value = data.user
  }

  // 登出 action：清空 token 与用户信息，下次请求拦截器读不到 token 自然不再注入 Authorization
  function logout(): void {
    persistToken('')
    currentUser.value = null
  }

  // 拉取当前用户：用于刷新页面后从 token 反查用户信息
  async function fetchCurrentUser(): Promise<void> {
    if (!token.value) return
    const data = await http.get<User>('/me')
    currentUser.value = data
  }

  return {
    token,
    currentUser,
    isLoggedIn,
    login,
    logout,
    fetchCurrentUser
  }
})