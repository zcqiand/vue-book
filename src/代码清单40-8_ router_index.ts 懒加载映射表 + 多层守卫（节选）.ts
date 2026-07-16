import { createRouter, createWebHistory, type Router, type RouteRecordRaw } from 'vue-router'
import { useTenantStore } from '../stores/tenant'
import { useAuthStore } from '../stores/auth'
import { setupDynamicRoutes, teardownDynamicRoutes } from './dynamicRoutes'

// 懒加载路由组件（eager 默认 false，是静态字面量 → vitest 的 import-glob 可解析）。
// dev 下 main.ts 会在 MSW 注册 Service Worker 之前把这些模块全部预加载（进入浏览器缓存），
// 从而绕开 MSW SW 对 /src/* 动态导入的 404 拦截；生产构建不走 MSW，保持按需分块。
export const routeModuleLoaders = import.meta.glob('../views/**/*.vue')
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function view(p: string): any {
  return routeModuleLoaders[p]
}

export const staticRoutes: RouteRecordRaw[] = [
  { path: '/', redirect: '/acme/dashboard' },
  { path: '/login', name: 'login', component: { template: '<div class="p-4">登录页</div>' } },
  { path: '/403', name: 'forbidden', component: { template: '<div class="p-4 text-red-600">无权限</div>' } },

  // 租户布局（/:tenantId 作为父路由，子路由平铺）
  {
    path: '/:tenantId',
    component: view('../views/tenant/TenantLayout.vue'),
    children: [
      { path: 'dashboard', name: 'dashboard', component: view('../views/Dashboard.vue') },
      { path: 'roles', name: 'roles', component: view('../views/roles/RolesList.vue') },
      { path: 'menu-permissions', name: 'menu-permissions', component: view('../views/roles/MenuPermissions.vue') },
      { path: 'api-keys', name: 'tenant-api-keys', component: view('../views/auth/ApiKeysList.vue') },
      // …其余子路由省略
    ],
  },
]

export function createAppRouter(): Router {
  const router = createRouter({ history: createWebHistory(), routes: [...staticRoutes] })

  // 第一个守卫：解析租户 → init store → 注册动态路由
  router.beforeEach(async (to) => {
    if (['login', 'forbidden'].includes(String(to.name)) || ['/', '/403'].includes(to.path)) return true
    if (to.path.startsWith('/platform')) return true

    const tenantStore = useTenantStore()
    const tenantId = (to.params.tenantId as string) || tenantStore.resolveTenantIdFromPath(to.path)
    if (!tenantId) return { name: 'login' }

    // 租户变化时：teardown 旧动态路由 → init 新租户 → setup 新动态路由
    if (tenantStore.current?.id !== tenantId) {
      const previous = tenantStore.current
      if (previous) teardownDynamicRoutes(router, previous)
      await tenantStore.initFromLocation(tenantId)
      if (tenantStore.current) setupDynamicRoutes(router, tenantStore.current)
    }

    if (tenantStore.error) return { name: 'login' }
    return true
  })

  // 第二个守卫：RBAC 校验——读 meta.requiresPermission，未通过跳 /403
  router.beforeEach((to) => {
    const required = to.meta.requiresPermission as string | string[] | undefined
    if (!required) return true
    const auth = useAuthStore()
    if (!auth.token) return { name: 'login' }
    const ok = Array.isArray(required)
      ? required.some((p) => auth.permissions.includes(p))
      : auth.permissions.includes(required)
    if (!ok) return { name: 'forbidden' }
    return true
  })

  return router
}

export default createAppRouter