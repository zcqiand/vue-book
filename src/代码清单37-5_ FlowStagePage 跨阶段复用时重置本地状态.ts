watch(
  () => props.stage,
  async () => {
    selected.value = []
    selectedMine.value = []
    showMine.value = false
    triFilter.value = props.stage ? 'not_yet' : 'all'
    keyword.value = ''
    notice.value = null
    await refreshStageList()
  },
)