async function handleAction(action: FlowAction) {
  if (!selected.value.length) return
  actionLoading.value = true
  try {
    const results = await receipt.flowAction({ ids: selected.value, action, operator: 'current-user' })
    selected.value = []
    await refreshStageList()
    const ok = results.filter((r) => r.ok).length
    if (ok > 0) notice.value = `已${actionLabel(action)} ${ok} 条`
  } finally { actionLoading.value = false }
}