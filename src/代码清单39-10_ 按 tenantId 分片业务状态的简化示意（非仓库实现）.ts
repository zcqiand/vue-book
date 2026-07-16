import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { apiClient } from '@/api/client'
import { useTenantStore } from '@/stores/tenant'

export interface ResourceItem {
  id: string
  name: string
  status: 'idle' | 'running' | 'archived'
}

// 简化示意：演示按 tenantId 分片业务列表的写法。
// saas-identity-platform-vue 仓库里没有这个文件，user/audit 数据分片由
// tenant store 的 switchTenant 清空 current + 拦截器统一带 X-Tenant-ID 间接保证。
export const useResourceStore = defineStore('resource', () => {
  const tenantStore = useTenantStore()

  // 用租户 ID 作为 key 存储列表，避免全局单一数组
  const resourcesByTenantId = ref<Record<string, ResourceItem[]>>({})
  const loadingByTenantId = ref<Record<string, boolean>>({})

  // 当前租户对应的列表：currentTenant 一变，computed 自动指向新分片
  const activeResources = computed(() => {
    const tenantId = tenantStore.current?.id
    if (!tenantId) return []
    return resourcesByTenantId.value[tenantId] ?? []
  })

  async function loadResources(): Promise<ResourceItem[]> {
    const tenantId = tenantStore.current?.id
    if (!tenantId) {
      throw new Error('Cannot load resources before tenant is initialized.')
    }
    loadingByTenantId.value = { ...loadingByTenantId.value, [tenantId]: true }
    try {
      // 拦截器会自动注入 X-Tenant-ID，这里不必手写请求头
      const res = await apiClient.get<ResourceItem[]>('/resources')
      resourcesByTenantId.value = {
        ...resourcesByTenantId.value,
        [tenantId]: res.data,
      }
      return res.data
    } finally {
      loadingByTenantId.value = { ...loadingByTenantId.value, [tenantId]: false }
    }
  }

  // 切换租户时由 tenant store 触发清理（也可注册回调）
  function resetForTenant(tenantId: string): void {
    const next = { ...resourcesByTenantId.value }
    delete next[tenantId]
    resourcesByTenantId.value = next
  }

  return { activeResources, loadResources, resetForTenant }
})