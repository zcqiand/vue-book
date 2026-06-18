import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

function getToken(): string | null {
  return localStorage.getItem('token')
}

function isRouteRequiresAuth(to: RouteLocationNormalized): boolean {
  return (to.meta.requiresAuth as boolean) === true
}

function createAuthGuard() {
  return (
    to: RouteLocationNormalized,
    _from: RouteLocationNormalized,
    next: NavigationGuardNext
  ): void => {
    const token = getToken()
    const requiresAuth = isRouteRequiresAuth(to)

    if (requiresAuth && !token) {
      next({ name: 'Login', query: { redirect: to.fullPath } })
    } else {
      next()
    }
  }
}

export { createAuthGuard }