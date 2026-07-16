export const useReportStore = defineStore('report', () => {
  const list = ref<Report[]>([]); const total = ref(0)
  const current = ref<Report | null>(null); const loading = ref(false); const error = ref<string | null>(null)

  async function fetchReports(query: ReportQuery): Promise<void> { /* GET /reports */ }
  async function createReport(input: ReportCreateInput): Promise<void> { /* POST /reports */ }
  async function updateReport(id: string, input: ReportUpdateInput): Promise<void> { /* PUT /reports/:id */ }
  async function deleteReport(id: string): Promise<void> { /* DELETE /reports/:id */ }
  /** 报告审核：submit/approve/reject（POST /reports/:id/review） */
  async function reviewReport(id: string, action: ReviewAction): Promise<void> {
    const { data } = await apiClient.post<Report>(`/reports/${id}/review`, { action })
    list.value = list.value.map((r) => (r.id === id ? data : r))
    if (current.value?.id === id) current.value = data
  }
  // …
})