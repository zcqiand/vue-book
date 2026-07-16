const store = useReceiptStore()
await store.fetchReceipts({ page: 1, pageSize: 100 })
const submittable = store.list.find((r) => r.flowStatus !== 'archived')
const beforeStatus = submittable!.flowStatus

const results = await store.flowAction({
  ids: [submittable!.id], action: 'submit', operator: 'integration-tester',
})
expect(results[0].ok).toBe(true)
const after = store.list.find((r) => r.id === submittable!.id)
expect(after?.flowStatus).not.toBe(beforeStatus)