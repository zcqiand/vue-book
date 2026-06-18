import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { refreshSessionByTenant } from '@/api/auth'
import { useTenantStore } from '@/stores/tenant'
import type { AuthSession, AuthUser, Permission, Role } from '@/types/auth'

const AUTH_STORAGE_KEY = 'saas-auth-session'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const expiresAt = ref<string | null>(null)
  const user = ref<AuthUser | null>(null)
  const tenantId = ref<string | null>(null)
  const roles = ref<Role[]>([])
  const permissions = ref<Permission[]>([])
  const restored = ref(false)
  const tenantWatcherBound = ref(false)

  const isAuthenticated = computed(() => accessToken.value !== null && user.value !== null)

  function persistSession(session: AuthSession): void {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
  }

  async function applySession(session: AuthSession): Promise<void> {
    accessToken.value = session.accessToken
    refreshToken.value = session.refreshToken
    expiresAt.value = session.expiresAt
    user.value = session.user
    tenantId.value = session.tenantId
    roles.value = session.roles
    permissions.value = session.permissions

    const tenantStore = useTenantStore()
    tenantStore.availableTenants = session.availableTenants

    const nextTenant = session.availableTenants.find((tenant) => tenant.id === session.tenantId)
    if (!nextTenant) {
      throw new Error(`当前会话的租户不存在：${session.tenantId}`)
    }

    await tenantStore.initializeTenant(nextTenant.slug)
    persistSession(session)
  }

  async function restoreFromStorage(): Promise<void> {
    if (restored.value) {
      return
    }

    restored.value = true
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (raw === null) {
      return
    }

    try {
      const session = JSON.parse(raw) as AuthSession
      await applySession(session)

      const tenantStore = useTenantStore()
      if (tenantStore.currentTenantId.length > 0) {
        await refreshTenantPermissions(tenantStore.currentTenantId)
      }
    } catch {
      logout()
    }
  }

  async function refreshTenantPermissions(nextTenantId: string): Promise<void> {
    if (accessToken.value === null) {
      throw new Error('刷新租户权限前必须先登录')
    }

    const nextSession = await refreshSessionByTenant(accessToken.value, nextTenantId)
    await applySession(nextSession)
  }

  function bindTenantPermissionRefresh(): void {
    if (tenantWatcherBound.value) {
      return
    }

    tenantWatcherBound.value = true
    const tenantStore = useTenantStore()

    tenantStore.onTenantChanged(async (nextTenant) => {
      if (isAuthenticated.value && nextTenant.id !== tenantId.value) {
        await refreshTenantPermissions(nextTenant.id)
      }
    })
  }

  function logout(): void {
    accessToken.value = null
    refreshToken.value = null
    expiresAt.value = null
    user.value = null
    tenantId.value = null
    roles.value = []
    permissions.value = []
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }

  return {
    accessToken,
    refreshToken,
    expiresAt,
    user,
    tenantId,
    roles,
    permissions,
    isAuthenticated,
    applySession,
    restoreFromStorage,
    refreshTenantPermissions,
    bindTenantPermissionRefresh,
    logout
  }
})