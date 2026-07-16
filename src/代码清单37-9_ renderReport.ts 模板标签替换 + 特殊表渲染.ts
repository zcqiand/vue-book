export function renderReportHtml(template: string, ctx: ReportContext): string {
  const receiptView = {
    ...ctx.receipt,
    resultLabel: ctx.receipt.result === 'pass' ? '合格' : ctx.receipt.result === 'fail' ? '不合格' : '待评定',
    issuedAt: ctx.receipt.issuedAt ? new Date(ctx.receipt.issuedAt).toLocaleDateString('zh-CN') : '',
  }
  const scope: Record<string, unknown> = {
    org: ctx.org ?? {}, contract: ctx.contract ?? {},
    receipt: receiptView, category: ctx.category ?? {},
  }
  return template.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, path: string) => {
    if (path === 'samplesTable') return buildSamplesTable(ctx)
    if (path === 'testItemsTable') return buildTestItemsTable(ctx)
    const segments = path.split('.')
    let value: unknown = scope
    for (const seg of segments) {
      if (value && typeof value === 'object' && seg in (value as Record<string, unknown>)) {
        value = (value as Record<string, unknown>)[seg]
      } else return ''
    }
    return esc(value)
  })
}