const deleteTarget = ref<SampleReceipt | null>(null)
async function onDelete() {
  if (!deleteTarget.value) return
  await receipt.deleteReceipt(deleteTarget.value.id)
  deleteTarget.value = null
}