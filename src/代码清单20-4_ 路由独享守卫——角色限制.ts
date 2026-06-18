import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

function createRoleGuard(allowedRoles: string[]) {
  return (
    _to: RouteLocationNormalized,
    _from: RouteLocationNormalized,
    next: NavigationGuardNext
  ): void => {
    const userRole = localStorage.getItem('userRole') ?? 'guest'
    const hasPermission = (allowedRoles as string[]).includes(userRole)

    if (hasPermission) {
      next()
    } else {
      next({ name: 'Dashboard' })
    }
  }
}

// 在路由表中使用：
// {
//   path: 'settings',
//   name: 'Settings',
//   component: () => import('../views/SettingsView.vue'),
//   beforeEnter: createRoleGuard(['admin']),
// }