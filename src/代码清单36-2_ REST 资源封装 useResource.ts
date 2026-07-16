export function useResource<T extends { id: string }>(basePath: string) {
  const items = ref<T[]>([])
  const total = ref(0)
  const loading = ref(false)
  const error = ref('')

  async function load(params?: Record<string, unknown>): Promise<void> {
    loading.value = true
    error.value = ''
    try {
      const { data } = await apiClient.get<Page<T>>(basePath, { params })
      items.value = data.items
      total.value = data.total
    } catch (e) {
      error.value = extractMessage(e) ?? '加载失败'
    } finally {
      loading.value = false
    }
  }

  async function create(payload: Partial<T>): Promise<T | null> {
    error.value = ''
    try {
      const { data } = await apiClient.post<T>(basePath, payload)
      items.value = [data, ...items.value] as typeof items.value
      total.value += 1
      return data
    } catch (e) {
      error.value = extractMessage(e) ?? '创建失败'
      return null
    }
  }

  async function update(id: string, payload: Partial<T>): Promise<T | null> {
    error.value = ''
    try {
      const { data } = await apiClient.put<T>(`${basePath}/${id}`, payload)
      items.value = items.value.map((it) => (it.id === id ? { ...it, ...data } : it))
      return data
    } catch (e) {
      error.value = extractMessage(e) ?? '更新失败'
      return null
    }
  }

  async function remove(id: string): Promise<boolean> {
    error.value = ''
    try {
      await apiClient.delete(`${basePath}/${id}`)
      items.value = items.value.filter((it) => it.id !== id)
      total.value = Math.max(0, total.value - 1)
      return true
    } catch (e) {
      error.value = extractMessage(e) ?? '删除失败'
      return false
    }
  }

  return { items, total, loading, error, load, create, update, remove, reset }
}