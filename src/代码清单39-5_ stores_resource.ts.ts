import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { apiFetch } from '@/api/client'
import { useTenantStore } from '@/stores/tenant'

export interface ResourceItem {
  id: string
  name: string
  status: 'idle' | 'running' | 'archived'
}

export const useResourceStore = defineStore('resource', () => {
  const tenantStore = useTenantStore()

  const unsafeGlobalList = ref<ResourceItem[]>([])
  const resourcesByTenantId = ref<Record<string, ResourceItem[]>>({})
  const loadingByTenantId = ref<Record<string, boolean>>({})

  const activeResources = computed(() => {
    const tenantId = tenantStore.currentTenantId

    if (!tenantId) {
      return []
    }

    return resourcesByTenantId.value[tenantId] ?? []
  })

  function replaceUnsafeGlobalListForDemoOnly(items: ResourceItem[]): void {
    // 单一全局 list 会让上一个租户的数据短暂显示给下一个租户。
    unsafeGlobalList.value = items
  }

  async function loadResources(): Promise<ResourceItem[]> {
    const tenantId = tenantStore.currentTenantId

    if (!tenantId) {
      throw new Error('Cannot load resources before tenant is initialized.')
    }

    loadingByTenantId.value = {
      ...loadingByTenantId.value,
      [tenantId]: true
    }

    try {
      const resources = await apiFetch<ResourceItem[]>('/resources')

      resourcesByTenantId.value = {
        ...resourcesByTenantId.value,
        [tenantId]: resources
      }

      return resources
    } finally {
      loadingByTenantId.value = {
        ...loadingByTenantId.value,
        [tenantId]: false
      }
    }
  }

  function resetForTenant(tenantId: string): void {
    const nextResources = { ...resourcesByTenantId.value }
    const nextLoading = { ...loadingByTenantId.value }

    delete nextResources[tenantId]
    delete nextLoading[tenantId]

    resourcesByTenantId.value = nextResources
    loadingByTenantId.value = nextLoading
  }

  function resetAll(): void {
    resourcesByTenantId.value = {}
    loadingByTenantId.value = {}
    unsafeGlobalList.value = []
  }

  function registerTenantResourceCleanup(): () => void {
    return tenantStore.onTenantChanged((_nextTenant, previousTenant) => {
      if (previousTenant) {
        resetForTenant(previousTenant.id)
      }
    })
  }

  return {
    unsafeGlobalList,
    activeResources,
    replaceUnsafeGlobalListForDemoOnly,
    loadResources,
    resetForTenant,
    resetAll,
    registerTenantResourceCleanup
  }
})