import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { refreshSessionByTenant } from '@/api/auth'
import { useTenantStore } from '@/stores/tenant'
import type { AuthSession, AuthUser, Permission, Role } from '@/types/auth'

const AUTH_STORAGE_KEY = 'chapter40.authSession'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const expiresAt = ref<string | null>(null)
  const user = ref<AuthUser | null>(null)
  const tenantId = ref<string | null>(null)
  const roles = ref<Role[]>([])
  const permissions = ref<Permission[]>([])
  const initialized = ref(false)

  const isAuthenticated = computed(() => accessToken.value !== null && user.value !== null)

  function persistSession(session: AuthSession): void {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
  }

  function applySession(session: AuthSession): void {
    accessToken.value = session.accessToken
    refreshToken.value = session.refreshToken
    expiresAt.value = session.expiresAt
    user.value = session.user
    tenantId.value = session.tenantId
    roles.value = session.roles
    permissions.value = session.permissions

    const tenantStore = useTenantStore()
    tenantStore.setAvailableTenants(session.availableTenants)
    tenantStore.setSelectedTenantId(session.tenantId)

    persistSession(session)
  }

  async function restoreFromStorage(): Promise<void> {
    if (initialized.value) {
      return
    }

    initialized.value = true
    const rawSession = localStorage.getItem(AUTH_STORAGE_KEY)

    if (rawSession === null) {
      return
    }

    try {
      const session = JSON.parse(rawSession) as AuthSession
      applySession(session)

      const tenantStore = useTenantStore()
      await tenantStore.initializeTenant()

      if (tenantStore.selectedTenantId !== null) {
        await refreshTenantPermissions(tenantStore.selectedTenantId)
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
    applySession(nextSession)
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
    initialized,
    isAuthenticated,
    applySession,
    restoreFromStorage,
    refreshTenantPermissions,
    logout
  }
})