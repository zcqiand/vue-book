import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import type { Permission, Role } from '@/types/auth'

export function usePermission() {
  const authStore = useAuthStore()

  const permissionSet = computed(() => new Set(authStore.permissions))
  const roleSet = computed(() => new Set(authStore.roles))

  function hasPermission(permission: Permission): boolean {
    return permissionSet.value.has(permission)
  }

  function hasAnyPermission(permissions: Permission[]): boolean {
    return permissions.some((permission) => permissionSet.value.has(permission))
  }

  function hasAllPermissions(permissions: Permission[]): boolean {
    return permissions.every((permission) => permissionSet.value.has(permission))
  }

  function hasRole(role: Role): boolean {
    return roleSet.value.has(role)
  }

  function hasAnyRole(roles: Role[]): boolean {
    return roles.some((role) => roleSet.value.has(role))
  }

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole
  }
}