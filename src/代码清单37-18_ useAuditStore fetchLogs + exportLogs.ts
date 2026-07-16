export const useAuditStore = defineStore('audit', () => {
  const list = ref<AuditEntry[]>([]); const total = ref(0)
  const loading = ref(false); const error = ref<string | null>(null)

  async function fetchLogs(query: AuditQuery): Promise<void> {
    loading.value = true; error.value = null
    try {
      const params: Record<string, string> = {
        page: String(query.page), pageSize: String(query.pageSize),
      }
      if (query.keyword) params.keyword = query.keyword
      if (query.type) params.type = query.type
      if (query.dateFrom) params.dateFrom = query.dateFrom
      if (query.dateTo) params.dateTo = query.dateTo
      const { data } = await apiClient.get<AuditPage>('/audit-logs', { params })
      list.value = data.items; total.value = data.total
    } catch (e) { error.value = extractMessage(e) ?? '加载失败' }
    finally { loading.value = false }
  }

  async function exportLogs(query: AuditQuery, format: AuditExportFormat): Promise<Blob> {
    /* 同样过滤参数拉一次 /audit-logs，根据 format 构造 Blob：
       - json：JSON.stringify(items, null, 2)
       - csv：BOM + 双引号包裹 + 字段转义（" → ""） */
  }
})