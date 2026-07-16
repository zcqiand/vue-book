import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { apiClient } from '@/api/client'
import type { Contract, ReportCategory } from '@/types/api'

/** inspection store（ch36）：检测模块的共享字典 / 项目集合缓存。
 * setup store 风格：暴露 reportCategories（报告类别字典）、contracts（合同列表缓存）+ load 动作。
 * 多个视图共享同一份字典缓存，避免每个页面各自请求。
 */
export const useInspectionStore = defineStore('inspection', () => {
  const reportCategories = ref<ReportCategory[]>([])
  const contracts = ref<Contract[]>([])
  const loaded = ref(false)

  const categoryByCode = computed(() => {
    const map = new Map<string, ReportCategory>()
    for (const c of reportCategories.value) map.set(c.code, c)
    return map
  })

  async function loadDictionaries(): Promise<void> {
    if (loaded.value) return
    try {
      const [{ data: cats }, { data: contractPage }] = await Promise.all([
        apiClient.get<{ items: ReportCategory[] }>('/report-categories', { params: { page: 1, pageSize: 100 } }),
        apiClient.get<{ items: Contract[]; total: number }>('/contracts', { params: { page: 1, pageSize: 100 } }),
      ])
      reportCategories.value = cats.items
      contracts.value = contractPage.items
      loaded.value = true
    } catch {
      // 静默失败：字典加载失败不应阻塞页面渲染，业务组件可读 store 空状态显示兜底
    }
  }

  function reset(): void {
    reportCategories.value = []
    contracts.value = []
    loaded.value = false
  }

  return {
    reportCategories,
    contracts,
    loaded,
    categoryByCode,
    loadDictionaries,
    reset,
  }
})