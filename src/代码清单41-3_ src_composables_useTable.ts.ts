import { computed, reactive, ref } from 'vue'
import type { PageResult } from '@/stores/user'

export interface TableState<Q extends Record<string, unknown>> {
  page: number
  pageSize: number
  total: number
  query: Q
}

export function useTable<T, Q extends Record<string, unknown>>(
  loader: (query: Q & { page: number; pageSize: number }) => Promise<PageResult<T>>,
  initialQuery: Q,
  initialPageSize = 10
) {
  const rows = ref<T[]>([])
  const loading = ref(false)
  const error = ref('')

  const state = reactive<TableState<Q>>({
    page: 1,
    pageSize: initialPageSize,
    total: 0,
    query: { ...initialQuery } as Q
  })

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

  async function search(): Promise<void> {
    state.page = 1
    await reload()
  }

  async function nextPage(): Promise<void> {
    if (state.page >= pageCount.value) {
      return
    }
    state.page += 1
    await reload()
  }

  async function previousPage(): Promise<void> {
    if (state.page <= 1) {
      return
    }
    state.page -= 1
    await reload()
  }

  return {
    rows,
    loading,
    error,
    state,
    pageCount,
    reload,
    search,
    nextPage,
    previousPage
  }
}