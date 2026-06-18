import { ref, reactive, computed, watch, type Ref, type ComputedRef } from 'vue'
import type { ListQuery } from '@/composables/useResource'

export type SortOrder = 'asc' | 'desc'

type MutableSearch<Search extends object> = {
  -readonly [Key in keyof Search]: Search[Key]
}

export interface UseTableOptions<Search extends object> {
  initialPage?: number
  initialPageSize?: number
  initialSearch: Search
  initialSortField?: string
  initialSortOrder?: SortOrder
}

export interface UseTableReturn<Search extends object> {
  page: Ref<number>
  pageSize: Ref<number>
  search: Search
  sortField: Ref<string>
  sortOrder: Ref<SortOrder>
  loading: Ref<boolean>
  queryParams: ComputedRef<ListQuery & Search>
  reload: () => void
  resetSearch: () => void
  changePage: (next: number) => void
  changePageSize: (next: number) => void
  toggleSort: (field: string) => void
  bindReload: (handler: () => void) => void
}

export function useTable<Search extends object>(
  options: UseTableOptions<Search>
): UseTableReturn<Search> {
  const {
    initialPage = 1,
    initialPageSize = 10,
    initialSearch,
    initialSortField = 'createdAt',
    initialSortOrder = 'desc'
  } = options

  const page = ref(initialPage)
  const pageSize = ref(initialPageSize)
  const search = reactive({ ...initialSearch }) as MutableSearch<Search> & Search
  const sortField = ref(initialSortField)
  const sortOrder = ref<SortOrder>(initialSortOrder)
  const loading = ref(false)

  const queryParams = computed<ListQuery & Search>(() => {
    return {
      page: page.value,
      pageSize: pageSize.value,
      sortField: sortField.value,
      sortOrder: sortOrder.value,
      ...search
    } as ListQuery & Search
  })

  let reloadHandler: (() => void) | null = null
  function reload(): void {
    reloadHandler?.()
  }

  function bindReload(handler: () => void): void {
    reloadHandler = handler
  }

  function resetSearch(): void {
    for (const key of Object.keys(initialSearch) as (keyof Search)[]) {
      ;(search as MutableSearch<Search>)[key] = initialSearch[key]
    }
    page.value = 1
    reload()
  }

  function changePage(next: number): void {
    if (next < 1 || next === page.value) return
    page.value = next
    reload()
  }

  function changePageSize(next: number): void {
    if (next < 1 || next === pageSize.value) return
    pageSize.value = next
    page.value = 1
    reload()
  }

  function toggleSort(field: string): void {
    if (sortField.value === field) {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortField.value = field
      sortOrder.value = 'desc'
    }
    page.value = 1
    reload()
  }

  // 教学示例保留兜底，生产可删：若调用方绕过 changePageSize 直接改 pageSize，也能回到第 1 页。
  watch(pageSize, () => {
    if (page.value !== 1) page.value = 1
  })

  return {
    page,
    pageSize,
    search,
    sortField,
    sortOrder,
    loading,
    queryParams,
    reload,
    resetSearch,
    changePage,
    changePageSize,
    toggleSort,
    bindReload
  }
}