import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Permission, User } from '@/types/api'
import { apiClient, setToken } from '@/api/client'

// router 动态导入避免循环依赖（router → auth → router）。
// logout/handleUnauthorized 里用 getRouter() 取实例。
async function getRouter() {
  const { router } = await import('@/router')
  return router
}

const TOKEN_KEY = 'lab-admin-token'
const USER_KEY = 'lab-admin-user'

/** auth store —— setup store 风格（返回 arrow fns / refs）。
 * 持有 token / 当前用户 / 权限集合，提供 login / logout / restore / hasPermission。
 * - login：调 /auth/login → 持久化 token+user → 同步给 apiClient（注入 Authorization）。
 * - logout：清状态 + 清持久化 + 跳 /login。
 * - restore：从 localStorage 恢复（页面刷新后 router.beforeEach 调用）。
 * - handleUnauthorized：响应拦截器命中 401 时回调（清状态 + 跳登录）。
 */
export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const user = ref<User | null>(null)

  const isAuthenticated = computed(() => token.value !== null && user.value !== null)
  const role = computed(() => user.value?.role.name ?? '')
  const permissions = computed<Permission[]>(() => user.value?.permissions ?? [])

  /** 是否拥有指定权限码（resource:action） */
  function hasPermission(code: Permission): boolean {
    return permissions.value.includes(code)
  }

  /** 多权限任一命中（侧边栏菜单项过滤用） */
  function hasAnyPermission(codes: Permission[]): boolean {
    if (codes.length === 0) return true
    return codes.some((c) => permissions.value.includes(c))
  }

  /** 登录：成功返回 true，失败抛错（携带后端 message） */
  async function login(username: string, password: string): Promise<boolean> {
    try {
      const { data } = await apiClient.post<{ token: string; user: User }>('/auth/login', {
        username,
        password,
      })
      token.value = data.token
      user.value = data.user
      persist()
      setToken(data.token)
      return true
    } catch {
      // 登录失败：保持未登录，由调用方提示
      return false
    }
  }

  /** 退出登录 */
  async function logout(): Promise<void> {
    token.value = null
    user.value = null
    clearPersist()
    setToken(null)
    const router = await getRouter()
    await router.push({ name: 'login' })
  }

  /** 从 localStorage 恢复登录态（页面刷新场景） */
  function restore(): void {
    const savedToken = localStorage.getItem(TOKEN_KEY)
    const savedUser = localStorage.getItem(USER_KEY)
    if (savedToken && savedUser) {
      try {
        token.value = savedToken
        user.value = JSON.parse(savedUser) as User
        setToken(savedToken)
      } catch {
        clearPersist()
        token.value = null
        user.value = null
      }
    }
  }

  /** 401 回调：清状态 + 跳登录（仅当当前不在登录页时） */
  function handleUnauthorized(): void {
    token.value = null
    user.value = null
    clearPersist()
    setToken(null)
    void getRouter().then((router) => {
      const current = router.currentRoute.value
      if (current.name !== 'login') {
        void router.push({ name: 'login', query: { redirect: current.fullPath } })
      }
    })
  }

  function persist(): void {
    if (token.value && user.value) {
      localStorage.setItem(TOKEN_KEY, token.value)
      localStorage.setItem(USER_KEY, JSON.stringify(user.value))
    }
  }

  function clearPersist(): void {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  return {
    token,
    user,
    isAuthenticated,
    role,
    permissions,
    hasPermission,
    hasAnyPermission,
    login,
    logout,
    restore,
    handleUnauthorized,
  }
})