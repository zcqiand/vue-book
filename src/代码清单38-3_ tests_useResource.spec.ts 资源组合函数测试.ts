import { describe, expect, it, vi } from 'vitest'
import { ref, type Ref } from 'vue'

type ResourceId = string | number

interface ResourceApi<TItem, TCreatePayload, TUpdatePayload> {
  list: () => Promise<{ items: TItem[]; total: number }>
  create: (payload: TCreatePayload) => Promise<TItem>
  update: (id: ResourceId, payload: TUpdatePayload) => Promise<TItem>
  remove: (id: ResourceId) => Promise<void>
}

function deferred<T>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((innerResolve) => {
    resolve = innerResolve
  })
  return { promise, resolve }
}

function useResource<TItem extends { id: ResourceId }, TCreatePayload, TUpdatePayload>(
  api: ResourceApi<TItem, TCreatePayload, TUpdatePayload>,
) {
  const items = ref<TItem[]>([]) as Ref<TItem[]>
  const total = ref(0)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  async function runWithLoading<TResult>(task: () => Promise<TResult>): Promise<TResult> {
    loading.value = true
    error.value = null

    try {
      return await task()
    } catch (cause) {
      const normalizedError = cause instanceof Error ? cause : new Error(String(cause))
      error.value = normalizedError
      throw normalizedError
    } finally {
      loading.value = false
    }
  }

  async function list(): Promise<void> {
    await runWithLoading(async () => {
      const result = await api.list()
      items.value = result.items
      total.value = result.total
    })
  }

  async function create(payload: TCreatePayload): Promise<TItem> {
    return runWithLoading(async () => {
      const createdItem = await api.create(payload)
      items.value = [createdItem, ...items.value]
      total.value += 1
      return createdItem
    })
  }

  async function remove(id: ResourceId): Promise<void> {
    await runWithLoading(async () => {
      await api.remove(id)
      items.value = items.value.filter((item) => item.id !== id)
      total.value = Math.max(0, total.value - 1)
    })
  }

  return { items, total, loading, error, list, create, remove }
}

interface InspectionProject {
  id: number
  name: string
  status: '受理' | '检测中'
}

interface CreateInspectionProjectPayload {
  name: string
}

interface UpdateInspectionProjectPayload {
  name?: string
  status?: InspectionProject['status']
}

describe('useResource', () => {
  it('调用 list 时会转发 api.list，并在异步完成前后切换 loading', async () => {
    const listDeferred = deferred<{ items: InspectionProject[]; total: number }>()
    const api: ResourceApi<InspectionProject, CreateInspectionProjectPayload, UpdateInspectionProjectPayload> = {
      list: vi.fn(() => listDeferred.promise),
      create: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(),
    }
    const resource = useResource(api)

    const pendingTask = resource.list()
    expect(api.list).toHaveBeenCalledTimes(1)
    expect(resource.loading.value).toBe(true)

    listDeferred.resolve({
      items: [{ id: 1, name: '混凝土抗压检测', status: '受理' }],
      total: 1,
    })
    await pendingTask

    expect(resource.loading.value).toBe(false)
    expect(resource.error.value).toBeNull()
    expect(resource.items.value).toEqual([{ id: 1, name: '混凝土抗压检测', status: '受理' }])
    expect(resource.total.value).toBe(1)
  })

  it('调用 create 时会转发 payload，并把新项目插入列表开头', async () => {
    const api: ResourceApi<InspectionProject, CreateInspectionProjectPayload, UpdateInspectionProjectPayload> = {
      list: vi.fn(),
      create: vi.fn(async (payload) => ({ id: 2, name: payload.name, status: '受理' })),
      update: vi.fn(),
      remove: vi.fn(),
    }
    const resource = useResource(api)

    const createdItem = await resource.create({ name: '钢筋拉伸检测' })

    expect(api.create).toHaveBeenCalledWith({ name: '钢筋拉伸检测' })
    expect(createdItem).toEqual({ id: 2, name: '钢筋拉伸检测', status: '受理' })
    expect(resource.items.value[0]).toEqual(createdItem)
    expect(resource.total.value).toBe(1)
    expect(resource.loading.value).toBe(false)
  })

  it('调用 remove 时会转发 id，并从本地列表中移除对应项目', async () => {
    const api: ResourceApi<InspectionProject, CreateInspectionProjectPayload, UpdateInspectionProjectPayload> = {
      list: vi.fn(async () => ({
        items: [
          { id: 1, name: '混凝土抗压检测', status: '受理' },
          { id: 2, name: '钢筋拉伸检测', status: '检测中' },
        ],
        total: 2,
      })),
      create: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(async () => undefined),
    }
    const resource = useResource(api)

    await resource.list()
    await resource.remove(1)

    expect(api.remove).toHaveBeenCalledWith(1)
    expect(resource.items.value).toEqual([{ id: 2, name: '钢筋拉伸检测', status: '检测中' }])
    expect(resource.total.value).toBe(1)
    expect(resource.loading.value).toBe(false)
  })
})