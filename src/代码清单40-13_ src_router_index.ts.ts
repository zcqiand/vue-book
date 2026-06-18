import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTenantStore } from '@/stores/tenant'
import type { Permission, Role } from '@/types/auth'
import LoginView from '@/views/LoginView.vue'
import SsoCallbackView from '@/views/auth/SsoCallbackView.vue'
import OAuthCallbackView from '@/views/auth/OAuthCallbackView.vue'
import TenantDashboardView from '@/views/TenantDashboardView.vue'
import AdminUsersView from '@/views/AdminUsersView.vue'
import ForbiddenView from '@/views/ForbiddenView.vue'
import TenantRequiredView from '@/views/TenantRequiredView.vue'

declare module 'vue-router' {
  interface RouteMeta {
    public?: boolean
    requiresAuth?: boolean
    tenantRequired?: boolean
    requiredRoles?: Role[]
    requiredPermissions?: Permission[]
    requireAllPermissions?: boolean
  }
}

function redirectToLogin(to: RouteLocationNormalized) {
  return {
    name: 'login',
    query: {
      redirect: to.fullPath
    }
  }
}

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { public: true }
    },
    {
      path: '/auth/sso/callback',
      name: 'sso-callback',
      component: SsoCallbackView,
      meta: { public: true }
    },
    {
      path: '/auth/oauth/:provider/callback',
      name: 'oauth-callback',
      component: OAuthCallbackView,
      meta: { public: true }
    },
    {
      path: '/',
      name: 'dashboard',
      component: TenantDashboardView,
      meta: {
        requiresAuth: true,
        tenantRequired: true,
        requiredPermissions: ['dashboard:read']
      }
    },
    {
      path: '/admin/users',
      name: 'admin-users',
      component: AdminUsersView,
      meta: {
        requiresAuth: true,
        tenantRequired: true,
        requiredRoles: ['tenant-admin', 'platform-admin'],
        requiredPermissions: ['user:read']
      }
    },
    {
      path: '/tenant-required',
      name: 'tenant-required',
      component: TenantRequiredView,
      meta: { requiresAuth: true }
    },
    {
      path: '/403',
      name: 'forbidden',
      component: ForbiddenView,
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  const tenantStore = useTenantStore()

  await authStore.restoreFromStorage()

  if (to.meta.public === true) {
    return true
  }

  if (to.meta.requiresAuth === true && !authStore.isAuthenticated) {
    return redirectToLogin(to)
  }

  if (to.meta.tenantRequired === true) {
    await tenantStore.initializeTenant()

    if (tenantStore.selectedTenantId === null) {
      return { name: 'tenant-required' }
    }

    if (authStore.tenantId !== tenantStore.selectedTenantId) {
      await authStore.refreshTenantPermissions(tenantStore.selectedTenantId)
    }
  }

  const requiredRoles = to.meta.requiredRoles ?? []
  if (requiredRoles.length > 0 && !requiredRoles.some((role) => authStore.roles.includes(role))) {
    return { name: 'forbidden' }
  }

  const requiredPermissions = to.meta.requiredPermissions ?? []
  if (requiredPermissions.length > 0) {
    const allowed = to.meta.requireAllPermissions === true
      ? requiredPermissions.every((permission) => authStore.permissions.includes(permission))
      : requiredPermissions.some((permission) => authStore.permissions.includes(permission))

    if (!allowed) {
      return { name: 'forbidden' }
    }
  }

  return true
})