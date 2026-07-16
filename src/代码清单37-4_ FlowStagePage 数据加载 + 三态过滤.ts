const receipt = useReceiptStore()
onMounted(async () => {
  // 不带 flowStatus 过滤一次性拉全量，三态过滤全部走客户端
  await receipt.fetchReceipts({ page: 1, pageSize: 100 })
  await fetchSubmitted()
})

// 当前阶段列表（按 stage 过滤）
const stageItems = computed(() => receipt.list.filter((r) => r.flowStatus === props.stage))

// 三态过滤：all / not_yet / submitted
const displayItems = computed(() => {
  let base: SampleReceipt[]
  if (triFilter.value === 'submitted') {
    base = receipt.list.filter((r) => stageIndex(r.flowStatus) > stageIdx.value)
  } else if (triFilter.value === 'not_yet') {
    base = stageItems.value.filter((r) => r.lastSubmittedBy !== 'current-user')
  } else {
    base = receipt.list
  }
  const k = keyword.value.trim().toLowerCase()
  if (!k) return base
  return base.filter((r) =>
    (r.commissionCode ?? '').toLowerCase().includes(k) ||
    (r.reportCode ?? '').toLowerCase().includes(k) ||
    (r.receivedBy ?? '').toLowerCase().includes(k),
  )
})