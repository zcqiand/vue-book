export function useTable(initial: Partial<TableQuery> = {}) {
  const query = reactive<TableQuery>({
    page: 1, pageSize: 10, keyword: '',
    sortField: 'createdAt', sortOrder: 'desc',
    ...initial,
  })
  const reloadTick = ref(0)

  function buildParams(): Record<string, unknown> {
    const params: Record<string, unknown> = {
      page: query.page, pageSize: query.pageSize,
    }
    if (query.keyword.trim()) params.keyword = query.keyword.trim()
    if (query.sortField) {
      params.sortField = query.sortField
      params.sortOrder = query.sortOrder
    }
    return params
  }

  function search(kw: string): void {
    query.keyword = kw.trim()
    query.page = 1
    reload()
  }

  function sortBy(field: string): void {
    if (query.sortField === field) {
      query.sortOrder = query.sortOrder === 'asc' ? 'desc' : 'asc'
    } else {
      query.sortField = field
      query.sortOrder = 'asc'
    }
    reload()
  }

  function reset(): void {
    query.page = 1; query.pageSize = 10; query.keyword = ''
    query.sortField = 'createdAt'; query.sortOrder = 'desc'
    reload()
  }

  return { query, reloadTick, buildParams, reload, goToPage, search, sortBy, reset }
}