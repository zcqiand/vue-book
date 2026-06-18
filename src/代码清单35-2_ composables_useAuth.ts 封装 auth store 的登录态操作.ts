import { ref, type Ref, type ComputedRef } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { User } from '@/types/models'

// 返回值类型显式标注，便于 IDE 跳转与后续重构时一眼看到对外契约
export interface UseAuthReturn {
  user: ComputedRef<User | null>
  isAuthenticated: ComputedRef<boolean>
  loading: Ref<boolean>
  error: Ref<string>
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  hasPermission: (perm: string) => boolean
  hasRole: (role: string) => boolean
}

export function useAuth(): UseAuthReturn {
  const authStore = useAuthStore()
  // storeToRefs 解构 state 与 getter 才能保留响应式（第 23 章已展开）
  const { currentUser: user, isAuthenticated } = storeToRefs(authStore)

  // loading 与 error 是组件本地关心的 UI 状态，不放 store
  // 放 store 会让「A 页面登录中」时 B 页面也显示登录中，违反单一职责
  const loading = ref<boolean>(false)
  const error = ref<string>('')

  // useRouter 必须在 setup 同步调用，不能塞进异步函数里
  const router = useRouter()

  async function login(username: string, password: string): Promise<boolean> {
    loading.value = true
    error.value = ''
    try {
      await authStore.login(username, password)
      // 登录成功返回 true，由调用方决定跳哪里（通常读 route.query.redirect）
      return true
    } catch (err) {
      // ❶ 错误信息提取要兜底：axios 抛的可能是 Error 也可能是 AxiosError（带 response.data.message）
      if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = '登录失败，请稍后再试'
      }
      return false
    } finally {
      // finally 保证异常路径也能复位 loading，避免按钮永久禁用
      loading.value = false
    }
  }

  function logout(): void {
    authStore.logout()
    // 登出后跳登录页，且 replace 不留历史记录
    // 用户点返回不会回到已登出的页面，避免「看起来登出了实际还在」的困惑
    router.replace({ name: 'login' })
  }

  // hasPermission 与 hasRole 直接转发到 store，让组件无需直接 import store
  function hasPermission(perm: string): boolean {
    return authStore.hasPermission(perm)
  }
  function hasRole(role: string): boolean {
    return authStore.hasRole(role)
  }

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    hasPermission,
    hasRole
  }
}