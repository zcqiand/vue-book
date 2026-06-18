// 代码清单35-2: 路由守卫全局拦截
// src/router/guards.ts
import { createRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

export function setupRouterGuard(router: ReturnType<typeof createRouter>) {
  router.beforeEach((to, _from, next) => {
    const userStore = useUserStore()
    if (to.meta.requiresAuth && !userStore.isLoggedIn) {
      next({ name: 'Login', query: { redirect: to.fullPath } })
    } else {
      next()
    }
  })
}