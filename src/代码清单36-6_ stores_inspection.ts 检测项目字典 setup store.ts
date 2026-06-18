import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { http } from '@/api/http'
import type { ProjectStatus } from '@/api/inspection'

export interface DictItem {
  label: string
  value: ProjectStatus
}

// 后端当前只返回 label/value，本接口与 DictItem 同形，直接复用类型。
type RawDictItem = DictItem

export const useInspectionStore = defineStore('inspection', () => {
  const projectStatuses = ref<DictItem[]>([])
  let fetched = false

  const statusMap = computed<Map<ProjectStatus, string>>(() => {
    const map = new Map<ProjectStatus, string>()
    for (const item of projectStatuses.value) {
      map.set(item.value, item.label)
    }
    return map
  })

  const statusOptions = computed<DictItem[]>(() => projectStatuses.value)

  async function fetchStatuses(force = false): Promise<void> {
    if (fetched && !force) return
    try {
      const { data } = await http.get<RawDictItem[]>('/dictionaries/project-statuses')
      projectStatuses.value = data.map((item) => ({ label: item.label, value: item.value }))
      fetched = true
    } catch {
      projectStatuses.value = []
    }
  }

  return { projectStatuses, statusMap, statusOptions, fetchStatuses }
})