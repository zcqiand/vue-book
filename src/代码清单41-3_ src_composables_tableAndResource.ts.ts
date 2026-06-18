import { computed, reactive, ref } from 'vue'
import type { PageResult } from '@/stores/user'

export function useTable<T, Q extends Record<string, unknown>>(loader: (query: Q & { page: number; pageSize: number }) => Promise<PageResult<T>>, initialQuery: Q) {
  const rows = ref<T[]>([])
  const loading = ref(false)
  const error = ref('')
  const state = reactive({ page: 1, pageSize: 8, total: 0, query: { ...initialQuery } as Q })
  const pageCount = computed(() => Math.max(1, Math.ceil(state.total / state.pageSize)))
  async function reload(): Promise<void> {
    loading.value = true
    error.value = ''
    try {
      const result = await loader({ ...state.query, page: state.page, pageSize: state.pageSize })
      rows.value = result.items
      state.total = result.total
    } catch (caught) {
      error.value = caught instanceof Error ? caught.message : '表格加载失败'
    } finally {
      loading.value = false
    }
  }
  async function search(): Promise<void> { state.page = 1; await reload() }
  async function nextPage(): Promise<void> { if (state.page < pageCount.value) { state.page += 1; await reload() } }
  async function previousPage(): Promise<void> { if (state.page > 1) { state.page -= 1; await reload() } }
  return { rows, loading, error, state, pageCount, reload, search, nextPage, previousPage }
}

export function useResource<T extends Record<string, unknown>>(createEmpty: () => T, create: (payload: T) => Promise<unknown>, update: (id: string, payload: T) => Promise<unknown>, afterSaved: () => Promise<void>) {
  const visible = ref(false)
  const editingId = ref<string | null>(null)
  const form = reactive<T>(createEmpty())
  const error = ref('')
  function reset(next: T): void { for (const key of Object.keys(form) as Array<keyof T>) delete form[key]; Object.assign(form, next) }
  function openCreate(): void { editingId.value = null; reset(createEmpty()); visible.value = true }
  function openEdit(id: string, current: T): void { editingId.value = id; reset(JSON.parse(JSON.stringify(current)) as T); visible.value = true }
  async function save(): Promise<void> {
    try {
      const payload = JSON.parse(JSON.stringify(form)) as T
      editingId.value ? await update(editingId.value, payload) : await create(payload)
      await afterSaved()
      visible.value = false
    } catch (caught) {
      error.value = caught instanceof Error ? caught.message : '保存失败'
    }
  }
  return { visible, editingId, form, error, openCreate, openEdit, close: () => (visible.value = false), save }
}