fnTest(['M03.F01.I04'], 'flowAction 批量提交成功后刷新列表', async () => {
  const store = useReceiptStore()
  await store.fetchReceipts({ page: 1, pageSize: 100 })
  const submittable = store.list.find((r) => r.flowStatus !== 'archived')
  expect(submittable).toBeTruthy()

  const results = await store.flowAction({
    ids: [submittable!.id], action: 'submit', operator: 'tester',
  })
  expect(results).toHaveLength(1)
  expect(results[0].ok).toBe(true)
})