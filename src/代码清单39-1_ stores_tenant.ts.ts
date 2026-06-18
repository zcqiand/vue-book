import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export type TenantModule = 'dashboard' | 'billing' | 'lab'

export interface TenantTheme {
  logoText: string
  primaryColor: string
  surfaceColor: string
}

export interface Tenant {
  id: string
  slug: string
  name: string
  modules: TenantModule[]
  theme: TenantTheme
}

type TenantChangedCallback = (next: Tenant, previous: Tenant | null) => void | Promise<void>

const DEFAULT_TENANT_SLUG = 'acme'
const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1', '0.0.0.0'])

export const useTenantStore = defineStore('tenant', () => {
  const availableTenants = ref<Tenant[]>([
    {
      id: 'tenant_acme',
      slug: 'acme',
      name: 'Acme 建筑实验室',
      modules: ['dashboard', 'billing', 'lab'],
      theme: {
        logoText: 'ACME Lab',
        primaryColor: '#2563eb',
        surfaceColor: '#eff6ff'
      }
    },
    {
      id: 'tenant_globex',
      slug: 'globex',
      name: 'Globex 检测中心',
      modules: ['dashboard', 'lab'],
      theme: {
        logoText: 'Globex QA',
        primaryColor: '#16a34a',
        surfaceColor: '#f0fdf4'
      }
    },
    {
      id: 'tenant_initech',
      slug: 'initech',
      name: 'Initech 管理后台',
      modules: ['dashboard', 'billing'],
      theme: {
        logoText: 'Initech SaaS',
        primaryColor: '#9333ea',
        surfaceColor: '#faf5ff'
      }
    }
  ])

  const currentTenant = ref<Tenant | null>(null)
  const tenantChangedCallbacks = new Set<TenantChangedCallback>()
  const currentTenantId = computed(() => currentTenant.value?.id ?? '')

  function findTenantBySlug(slug: string | null | undefined): Tenant {
    const normalizedSlug = slug?.trim().toLowerCase() || DEFAULT_TENANT_SLUG
    const tenant = availableTenants.value.find((item) => item.slug === normalizedSlug)

    if (!tenant) {
      throw new Error(`Tenant not found: ${normalizedSlug}`)
    }

    return tenant
  }

  function parseTenantSlugFromPath(pathname: string): string | null {
    const segments = pathname.split('/').filter(Boolean)

    if (segments[0] === 't' && segments[1]) {
      return segments[1].toLowerCase()
    }

    return null
  }

  function parseTenantFromLocation(
    location: Pick<Location, 'hostname' | 'pathname' | 'search'> = window.location
  ): Tenant {
    const searchParams = new URLSearchParams(location.search)
    const queryTenant = searchParams.get('tenant')

    if (queryTenant) {
      return findTenantBySlug(queryTenant)
    }

    const pathTenant = parseTenantSlugFromPath(location.pathname)

    if (pathTenant) {
      return findTenantBySlug(pathTenant)
    }

    const hostnameParts = location.hostname.split('.')
    const subdomain = hostnameParts[0]
    const canUseSubdomain = hostnameParts.length >= 3 && !LOCAL_HOSTNAMES.has(location.hostname)

    if (canUseSubdomain && subdomain && subdomain !== 'app' && subdomain !== 'www') {
      return findTenantBySlug(subdomain)
    }

    return findTenantBySlug(DEFAULT_TENANT_SLUG)
  }

  async function runTenantChangedCallbacks(next: Tenant, previous: Tenant | null): Promise<void> {
    const callbacks = [...tenantChangedCallbacks]

    for (const callback of callbacks) {
      // 清理动作可能包含本地缓存和轮询关闭，用 await 保证切换租户前状态已经归位。
      await callback(next, previous)
    }
  }

  async function initializeTenant(slug?: string): Promise<Tenant> {
    const nextTenant = slug ? findTenantBySlug(slug) : parseTenantFromLocation()

    if (currentTenant.value?.id === nextTenant.id) {
      return nextTenant
    }

    const previousTenant = currentTenant.value
    currentTenant.value = nextTenant
    await runTenantChangedCallbacks(nextTenant, previousTenant)

    return nextTenant
  }

  async function switchTenant(slug: string): Promise<Tenant> {
    return initializeTenant(slug)
  }

  function onTenantChanged(callback: TenantChangedCallback): () => void {
    tenantChangedCallbacks.add(callback)

    return () => {
      tenantChangedCallbacks.delete(callback)
    }
  }

  return {
    availableTenants,
    currentTenant,
    currentTenantId,
    parseTenantSlugFromPath,
    parseTenantFromLocation,
    initializeTenant,
    switchTenant,
    onTenantChanged
  }
})