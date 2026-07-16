import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'

/** useAuth composable（ch35）：封装 auth store 给视图用。
 * 暴露登录态、当前用户、login（带错误提示）、logout、hasPermission。
 * 视图层只依赖这个 composable，store 内部实现变更时视图不动。
 */
export function useAuth() {
  const auth = useAuthStore()

  const isAuthenticated = computed(() => auth.isAuthenticated)
  const user = computed(() => auth.user)
  const role = computed(() => auth.role)
  const permissions = computed(() => auth.permissions)

  /** 登录：返回 { ok, message }，由视图提示用户（不抛错） */
  async function login(username: string, password: string): Promise<{ ok: boolean; message?: string }> {
    const ok = await auth.login(username, password)
    if (!ok) return { ok: false, message: '用户名或密码错误' }
    return { ok: true }
  }

  function logout() {
    return auth.logout()
  }

  function hasPermission(code: string): boolean {
    return auth.hasPermission(code)
  }

  function hasAnyPermission(codes: string[]): boolean {
    return auth.hasAnyPermission(codes)
  }

  return {
    isAuthenticated,
    user,
    role,
    permissions,
    login,
    logout,
    hasPermission,
    hasAnyPermission,
  }
}