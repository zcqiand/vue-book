const query = computed(() => ({
  page: page.value, pageSize: PAGE_SIZE,
  type: activeTab.value === 'all' ? undefined : activeTab.value,
  keyword: keyword.value || undefined,
  dateFrom: dateFrom.value || undefined,
  dateTo: dateTo.value || undefined,
}))