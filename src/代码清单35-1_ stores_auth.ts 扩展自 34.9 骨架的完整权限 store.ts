import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { http } from '@/api/http'
import type { User } from '@/types/models'

// JWT payload 段的类型定义：字段全部可选，不同后端塞进 payload 的内容差异较大
// sub 是 subject（用户唯一标识），role 与 permissions 是本书约定的 RBAC 字段
// exp 是过期时间（Unix 秒），用于判断 token 是否还在有效期内
export interface JwtPayload {
  sub?: string
  role?: string
  permissions?: string[]
  exp?: number
  [key: string]: unknown
}

// localStorage 键名集中成常量，避免多处写字符串字面量导致拼写不一致
const TOKEN_STORAGE_KEY = 'lab_admin_token'

export const useAuthStore = defineStore('auth', () => {
  // ❶ state：token 与 34.9 骨架一致，刷新页面时从 localStorage 恢复初始值
  const token = ref<string>(localStorage.getItem(TOKEN_STORAGE_KEY) ?? '')
  const currentUser = ref<User | null>(null)

  // ❷ 新增 state：roles 与 permissions 是 RBAC 的细粒度权限数据
  const roles = ref<string[]>([])
  const permissions = ref<string[]>([])

  // ❸ getter：isAuthenticated 替代原 isLoggedIn，语义更明确
  // 同时保留 isLoggedIn 作为别名指向同一 computed，避免 34.10 的 MainLayout 模板连锁改动
  const isAuthenticated = computed<boolean>(() => token.value.length > 0)
  const isLoggedIn = isAuthenticated
  const isAdmin = computed<boolean>(() => roles.value.includes('admin'))

  // ❹ 返回函数的 getter：hasRole 与 hasPermission 必须是函数，否则模板与守卫里无法传参
  function hasRole(role: string): boolean {
    return roles.value.includes(role)
  }
  function hasPermission(perm: string): boolean {
    return permissions.value.includes(perm)
  }

  // ❺ parseJwtPayload：只解码 JWT 的 payload 段，不做签名验证
  // 验签必须放在后端：前端代码可被篡改，前端验签等于没验
  function parseJwtPayload(jwt: string): JwtPayload {
    try {
      const parts = jwt.split('.')
      if (parts.length !== 3) {
        return {}
      }
      // ❻ Base64Url 解码：JWT 用的是 URL 安全的 Base64 变体，需先补回等号、还原 + 与 /
      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
      const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
      // ❼ decodeURIComponent + 逐字符百分号编码兼容中文 payload（如用户名包含中文）
      const jsonStr = decodeURIComponent(
        atob(padded)
          .split('')
          .map((char) => '%' + ('00' + char.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      return JSON.parse(jsonStr) as JwtPayload
    } catch {
      return {}
    }
  }

  // ❽ setToken 持久化逻辑：与 34.9 一致，封装在 store 内部，调用方不关心存储细节
  function setToken(newToken: string): void {
    token.value = newToken
    localStorage.setItem(TOKEN_STORAGE_KEY, newToken)
  }

  // ❾ login：调 http（第 32 章已封装好拦截器自动注入 Authorization 头，g-133）
  // 拿到 token 后立即解析 payload 写入 roles/permissions/currentUser，让守卫与指令能即时读到
  async function login(username: string, password: string): Promise<void> {
    const { data } = await http.post<{ token: string }>('/login', { username, password })
    setToken(data.token)
    // 立即解析 payload 派生权限数据，避免登录后还要再发一次 getCurrentUser 请求
    const payload = parseJwtPayload(data.token)
    roles.value = payload.role ? [payload.role] : []
    permissions.value = Array.isArray(payload.permissions) ? [...payload.permissions] : []
    currentUser.value = {
      id: Number(payload.sub) || 0,
      username,
      role: payload.role ?? 'user'
    }
  }

  // ❿ logout：清空所有权限相关状态，移除 localStorage 中的 token
  // 不只清 token：roles 与 permissions 残留会导致 hasRole/hasPermission 仍返回 true
  function logout(): void {
    token.value = ''
    currentUser.value = null
    roles.value = []
    permissions.value = []
    localStorage.removeItem(TOKEN_STORAGE_KEY)
  }

  // ⓫ restoreSession：刷新页面后 store 重置，从 localStorage 的 token 还原登录态
  // 路由守卫 beforeEach 会在第一次导航时调用它（见代码清单35-3）
  // 失败（token 过期或被篡改）时清空所有状态，相当于强制登出
  function restoreSession(): void {
    const stored = localStorage.getItem(TOKEN_STORAGE_KEY)
    if (!stored) {
      return
    }
    token.value = stored
    // 从 payload 还原权限数据，不依赖后端的 getCurrentUser 接口
    const payload = parseJwtPayload(stored)
    // ⓬ exp 是 Unix 秒，转毫秒后与 Date.now() 比较；过期则视为未登录
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      logout()
      return
    }
    roles.value = payload.role ? [payload.role] : []
    permissions.value = Array.isArray(payload.permissions) ? [...payload.permissions] : []
    currentUser.value = {
      id: Number(payload.sub) || 0,
      username: (payload['username'] as string | undefined) ?? '',
      role: payload.role ?? 'user'
    }
  }

  return {
    // state
    token,
    currentUser,
    roles,
    permissions,
    // getters
    isAuthenticated,
    isLoggedIn,
    isAdmin,
    hasRole,
    hasPermission,
    // actions
    setToken,
    login,
    logout,
    restoreSession
  }
})