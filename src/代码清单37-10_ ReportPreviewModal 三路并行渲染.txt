const props = defineProps<{ receipt: SampleReceipt }>()
const emit = defineEmits<{ close: [] }>()
const html = ref(''); const loading = ref(true); const error = ref<string | null>(null)

watch(() => props.receipt, async () => {
  loading.value = true; error.value = null
  try {
    const [tplRes, samplesRes, itemsRes] = await Promise.all([
      apiClient.get<{ items: ReportTemplate[] }>('/report-templates', {
        params: { categoryCode: props.receipt.categoryCode, page: 1, pageSize: 1 },
      }),
      apiClient.get<{ items: Sample[] }>('/samples', {
        params: { receiptId: props.receipt.id, page: 1, pageSize: 100 },
      }),
      apiClient.get<{ items: TestItem[] }>('/test-items', {
        params: { receiptId: props.receipt.id },
      }),
    ])
    const template = tplRes.data.items[0]
    if (!template) { error.value = '该报告类别尚无报告模板，请先在「报告模板」中维护'; loading.value = false; return }
    html.value = renderReportHtml(template.content, {
      org: null, contract: null, receipt: props.receipt, category: null,
      samples: samplesRes.data.items, items: itemsRes.data.items, parameterNames: {},
    })
  } catch (e: unknown) { error.value = e instanceof Error ? e.message : '报告生成失败' }
  finally { loading.value = false }
}, { immediate: true })

function handlePrint() {
  const w = window.open('', '_blank')
  if (!w) return
  w.document.write(wrapReportDocument(html.value, docTitle))
  w.document.close()
  setTimeout(() => w.print(), 100)
}
function handleDownloadWord() {
  const blob = new Blob([wrapReportDocument(html.value, docTitle)], { type: 'application/msword' })
  const url = URL.createObjectURL(blob); const a = document.createElement('a')
  a.href = url; a.download = `${docTitle}.doc`; a.click(); URL.revokeObjectURL(url)
}