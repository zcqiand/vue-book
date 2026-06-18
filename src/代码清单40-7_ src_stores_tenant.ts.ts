import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { TenantSummary } from '@/types/auth'

const SELECTED_TENANT_KEY = 'chapter40.selectedTenantId'

const defaultTenants: TenantSummary[] = [
  { id: 'tenant-acme', name: 'Acme 实验室' },
  { id: 'tenant-beta', name: 'Beta 研究院' }
]

export const useTenantStore = defineStore('tenant', () => {
  const tenants = ref<TenantSummary[]>([])
  const selectedTenantId = ref<string | null>(localStorage.getItem(SELECTED_TENANT_KEY))

  const selectedTenant = computed(() => tenants.value.find((tenant) => tenant.id === selectedTenantId.value) ?? null)

  function setAvailableTenants(nextTenants: TenantSummary[]): void {
    tenants.value = nextTenants.length > 0 ? nextTenants : defaultTenants

    if (selectedTenantId.value === null || !tenants.value.some((tenant) => tenant.id === selectedTenantId.value)) {
      setSelectedTenantId(tenants.value[0]?.id ?? null)
    }
  }

  function setSelectedTenantId(tenantId: string | null): void {
    selectedTenantId.value = tenantId

    if (tenantId === null) {
      localStorage.removeItem(SELECTED_TENANT_KEY)
      return
    }

    localStorage.setItem(SELECTED_TENANT_KEY, tenantId)
  }

  async function initializeTenant(): Promise<void> {
    if (tenants.value.length === 0) {
      setAvailableTenants(defaultTenants)
    }
  }

  async function switchTenant(tenantId: string): Promise<void> {
    if (!tenants.value.some((tenant) => tenant.id === tenantId)) {
      throw new Error(`无效租户：${tenantId}`)
    }

    setSelectedTenantId(tenantId)

    const { useAuthStore } = await import('@/stores/auth')
    const authStore = useAuthStore()

    if (authStore.isAuthenticated) {
      await authStore.refreshTenantPermissions(tenantId)
    }
  }

  return {
    tenants,
    selectedTenantId,
    selectedTenant,
    setAvailableTenants,
    setSelectedTenantId,
    initializeTenant,
    switchTenant
  }
})