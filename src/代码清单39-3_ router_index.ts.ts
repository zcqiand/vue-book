import { defineComponent, h } from 'vue'
import {
  createRouter,
  createWebHistory,
  type RouteLocationNormalizedLoaded,
  type RouteLocationRaw,
  type RouteRecordRaw
} from 'vue-router'
import TenantShell from '@/layouts/TenantShell.vue'
import { useTenantStore, type TenantModule } from '@/stores/tenant'
import { moduleByRouteName, setupDynamicRoutes } from '@/router/dynamicRoutes'

const NotFoundPage = defineComponent({
  name: 'NotFoundPage',
  setup() {
    return () => h('main', { class: 'p-8 text-slate-700' }, [
      h('h1', { class: 'text-2xl font-semibold' }, '页面不存在'),
      h('p', { class: 'mt-2' }, '请检查租户地址或模块权限。')
    ])
  }
})

const moduleByPathSegment: Readonly<Record<string, TenantModule>> = {
  dashboard: 'dashboard',
  billing: 'billing',
  lab: 'lab'
}

function getRequestedTenantModule(to: RouteLocationNormalizedLoaded): TenantModule | undefined {
  const routeName = typeof to.name === 'string' ? to.name : ''
  const moduleFromRouteName = moduleByRouteName[routeName]

  if (moduleFromRouteName) {
    return moduleFromRouteName
  }

  const segments = to.path.split('/').filter(Boolean)

  if (segments[0] !== 't' || !segments[2]) {
    return undefined
  }

  // 当动态子路由已被移除时，to.name 可能只剩父路由或 404；用 URL 片段兜底才能识别用户真正想访问的模块。
  return moduleByPathSegment[segments[2].toLowerCase()]
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/t/acme/dashboard'
  },
  {
    path: '/t/:tenantSlug',
    name: 'tenant-shell',
    component: TenantShell,
    children: [
      {
        path: '',
        redirect: (to): RouteLocationRaw => ({
          path: `/t/${String(to.params.tenantSlug)}/dashboard`,
          replace: true
        })
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundPage
  }
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to) => {
  const tenantStore = useTenantStore()
  const routeTenantSlug = typeof to.params.tenantSlug === 'string'
    ? to.params.tenantSlug
    : tenantStore.parseTenantSlugFromPath(to.path)

  if (!routeTenantSlug) {
    return true
  }

  try {
    const tenant = await tenantStore.initializeTenant(routeTenantSlug)
    const addedRoute = setupDynamicRoutes(router, tenant)
    const requestedModule = getRequestedTenantModule(to)

    if (requestedModule && !tenant.modules.includes(requestedModule)) {
      return {
        path: `/t/${tenant.slug}/dashboard`,
        replace: true
      }
    }

    if (addedRoute && (requestedModule || to.matched.length === 0)) {
      // addRoute 后当前 to 仍是旧匹配结果；重新进入同一地址，才能让新注册的动态子路由参与匹配。
      return to.fullPath
    }

    return true
  } catch {
    return {
      name: 'not-found',
      replace: true
    }
  }
})