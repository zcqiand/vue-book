import type { Router, RouteRecordName, RouteRecordRaw } from 'vue-router'
import type { Tenant, TenantModule } from '@/stores/tenant'

const routeNameByModule: Record<TenantModule, RouteRecordName> = {
  dashboard: 'tenant-dashboard',
  billing: 'tenant-billing',
  lab: 'tenant-lab'
}

export const moduleByRouteName: Readonly<Record<string, TenantModule>> = {
  'tenant-dashboard': 'dashboard',
  'tenant-billing': 'billing',
  'tenant-lab': 'lab'
}

const tenantModules: Record<TenantModule, RouteRecordRaw> = {
  dashboard: {
    path: 'dashboard',
    name: 'tenant-dashboard',
    component: () => import('@/pages/tenant/DashboardPage.vue'),
    meta: { tenantModule: 'dashboard' }
  },
  billing: {
    path: 'billing',
    name: 'tenant-billing',
    component: () => import('@/pages/tenant/BillingPage.vue'),
    meta: { tenantModule: 'billing' }
  },
  lab: {
    path: 'lab',
    name: 'tenant-lab',
    component: () => import('@/pages/tenant/LabPage.vue'),
    meta: { tenantModule: 'lab' }
  }
}

const registeredRouteRemovers = new Map<RouteRecordName, () => void>()

export function setupDynamicRoutes(router: Router, tenant: Tenant): boolean {
  let changed = false
  const allowedRouteNames = new Set(tenant.modules.map((moduleName) => routeNameByModule[moduleName]))

  for (const [routeName, removeRoute] of registeredRouteRemovers) {
    if (!allowedRouteNames.has(routeName)) {
      // addRoute 返回的清理函数比手动猜测路由层级更可靠。
      removeRoute()
      registeredRouteRemovers.delete(routeName)
      changed = true
    }
  }

  for (const moduleName of tenant.modules) {
    const routeRecord = tenantModules[moduleName]
    const routeName = routeRecord.name

    if (!routeName) {
      throw new Error(`Dynamic route for module ${moduleName} must have a name.`)
    }

    if (!router.hasRoute(routeName)) {
      const removeRoute = router.addRoute('tenant-shell', routeRecord)
      registeredRouteRemovers.set(routeName, removeRoute)
      changed = true
    }
  }

  return changed
}