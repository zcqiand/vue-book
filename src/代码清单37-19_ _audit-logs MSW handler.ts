http.get('*/audit-logs', ({ request }) => {
  const url = new URL(request.url)
  const page = Number(url.searchParams.get('page') ?? '1')
  const pageSize = Number(url.searchParams.get('pageSize') ?? '20')
  const type = url.searchParams.get('type') ?? undefined
  const keyword = url.searchParams.get('keyword') ?? undefined
  const dateFrom = url.searchParams.get('dateFrom') ?? undefined
  const dateTo = url.searchParams.get('dateTo') ?? undefined

  const result = auditTable.query({
    page, pageSize,
    keyword,
    keywordFields: ['action', 'operator', 'target', 'detail'],
    filters: type ? { type: type as AuditEntry['type'] } : undefined,
    dateField: 'at', dateFrom, dateTo,
    sortField: 'at',
  })
  const items: AuditEntry[] = result.items.map((r) => ({
    id: r.id, type: r.type, action: r.action, operator: r.operator,
    target: r.target, targetId: r.targetId, detail: r.detail,
    at: r.at, ip: r.ip,
  }))
  return HttpResponse.json({ items, total: result.total, page: result.page, pageSize: result.pageSize })
}),