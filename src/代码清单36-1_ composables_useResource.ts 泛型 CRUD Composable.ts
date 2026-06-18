import { ref, type Ref } from 'vue'

export interface PagedList<T> {
  items: T[]
  total: number
}

export interface ListQuery {
  page: number
  pageSize: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
}

export interface Resource {
  id: string | number
}

export interface ResourceApi<
  T extends Resource,
  Payload extends object,
  Search extends object = Record<string, never>
> {
  list: (query: ListQuery & Search) => Promise<PagedList<T>>
  create: (payload: Payload) => Promise<T>
  update: (id: T['id'], payload: Partial<Payload>) => Promise<T>
  remove: (id: T['id']) => Promise<void>
}

export interface UseResourceReturn<
  T extends Resource,
  Payload extends object,
  Search extends object = Record<string, never>
> {
  items: Ref<T[]>
  total: Ref<number>
  loading: Ref<boolean>
  error: Ref<string>
  list: (query: ListQuery & Search) => Promise<void>
  create: (payload: Payload) => Promise<boolean>
  update: (id: T['id'], payload: Partial<Payload>) => Promise<boolean>
  remove: (id: T['id']) => Promise<boolean>
}

export function useResource<
  T extends Resource,
  Payload extends object,
  Search extends object = Record<string, never>
>(api: ResourceApi<T, Payload, Search>): UseResourceReturn<T, Payload, Search> {
  const items = ref<T[]>([]) as Ref<T[]>
  const total = ref(0)
  const loading = ref(false)
  const error = ref('')
  let lastQuery: ListQuery & Search | null = null

  async function list(query: ListQuery & Search): Promise<void> {
    loading.value = true
    error.value = ''
    lastQuery = { ...query }
    try {
      const result = await api.list(lastQuery)
      items.value = result.items
      total.value = result.total
    } catch (err) {
      error.value = err instanceof Error ? err.message : '加载列表失败，请稍后再试'
    } finally {
      loading.value = false
    }
  }

  async function reload(): Promise<void> {
    if (!lastQuery) return
    await list(lastQuery)
  }

  async function create(payload: Payload): Promise<boolean> {
    loading.value = true
    error.value = ''
    try {
      await api.create(payload)
      await reload()
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : '新增失败，请稍后再试'
      return false
    } finally {
      loading.value = false
    }
  }

  async function update(id: T['id'], payload: Partial<Payload>): Promise<boolean> {
    loading.value = true
    error.value = ''
    try {
      await api.update(id, payload)
      await reload()
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : '更新失败，请稍后再试'
      return false
    } finally {
      loading.value = false
    }
  }

  async function remove(id: T['id']): Promise<boolean> {
    loading.value = true
    error.value = ''
    try {
      await api.remove(id)
      await reload()
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : '删除失败，请稍后再试'
      return false
    } finally {
      loading.value = false
    }
  }

  return { items, total, loading, error, list, create, update, remove }
}