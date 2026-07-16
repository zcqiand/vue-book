const contracts = useResource<Contract>('/contracts')
const receipt = useReceiptStore()
const sample = useSampleStore()

watch(() => props.open, (open) => {
  if (open) {
    void contracts.load({ page: 1, pageSize: 100 })
    /* 重置表单字段 */
  }
}, { immediate: true })

watch(contractId, (cid) => {
  if (cid) void receipt.fetchReceipts({ page: 1, pageSize: 100, contractId: cid })
  receiptId.value = ''; sampleIds.value = []
})
watch(receiptId, (rid) => {
  if (rid) void sample.fetchSamples(rid)
  sampleIds.value = []
})

const filteredReceipts = computed(() =>
  contractId.value ? receipt.list.filter((r) => r.contractId === contractId.value) : [],
)
const filteredSamples = computed(() =>
  receiptId.value ? sample.list.filter((s) => s.receiptId === receiptId.value) : [],
)