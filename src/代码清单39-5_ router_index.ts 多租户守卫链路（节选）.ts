// ch39/ch40 路由器：createRouter + beforeEach 多层守卫
// 节选说明：保留与多租户主线相关的静态路由骨架（公共入口 + /platform 占位 + /:tenantId 父路由）
// 与两段 beforeEach 守卫；/platform 下子路由、/:tenantId 下子路由明细见仓库源文件。
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

  // 平台管理（无租户上下文）：PlatformLayout 作父路由，子页面（config/tenants/apps/menus/open-platform）省略
  {
    path: '/platform',
    component: view('../views/platform/PlatformLayout.vue'),
    children: [
      // ……（config / tenants / tenants/:tenantId / apps / apps/:appId/menus / open-platform 等子路由省略）……
    ],
  },

  // 租户布局（/:tenantId 作为父路由，子路由平铺）
  {
    path: '/:tenantId',
    component: view('../views/tenant/TenantLayout.vue'),
    children: [
      // ……（dashboard / users / org / positions / roles / menu-permissions / audit /
      //      login-methods / token-config / api-keys / 各类 security 子路由省略）……
    ],
  },

  // 通配符兜底（必须排在 /:tenantId 之后，保证单段路径优先匹配租户）
  { path: '/:pathMatch(.*)*', redirect: '/acme/dashboard' },
]

export function createAppRouter(): Router {
  const router = createRouter({
    history: createWebHistory(),
    routes: [...staticRoutes],
  })

  // 公共路由放行
  router.beforeEach(async (to) => {
    if (['login', 'forbidden'].includes(String(to.name)) || ['/', '/403'].includes(to.path)) return true
    // /platform/* 放行（平台路由无租户上下文）
    if (to.path.startsWith('/platform')) return true

    const tenantStore = useTenantStore()
    const tenantId = (to.params.tenantId as string) || tenantStore.resolveTenantIdFromPath(to.path)

    if (!tenantId) {
      return { name: 'login' }
    }

    // 租户变化时重新初始化
    if (tenantStore.current?.id !== tenantId) {
      const previous = tenantStore.current
      if (previous) teardownDynamicRoutes(router, previous)
      await tenantStore.initFromLocation(tenantId)
      if (tenantStore.current) setupDynamicRoutes(router, tenantStore.current)
    }

    if (tenantStore.error) return { name: 'login' }
    return true
  })

  // RBAC 守卫
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