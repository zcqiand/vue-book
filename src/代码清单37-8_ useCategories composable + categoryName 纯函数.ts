export function useCategories() {
  const categories = ref<ReportCategory[]>([])
  const loading = ref(false)
  async function load(): Promise<void> {
    loading.value = true
    try {
      const { data } = await apiClient.get<{ items: ReportCategory[] }>('/report-categories', {
        params: { page: 1, pageSize: 100 },
      })
      categories.value = [...data.items].sort(
        (a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99),
      )
    } catch {
      categories.value = []
    } finally { loading.value = false }
  }
  return { categories, loading, load }
}

/** code → 中文名（命中返回 name；未命中回退 code；code 为空回退 —） */
export function categoryName(categories: ReportCategory[], code?: string): string {
  if (!code) return '—'
  return categories.find((c) => c.code === code)?.name ?? code
}