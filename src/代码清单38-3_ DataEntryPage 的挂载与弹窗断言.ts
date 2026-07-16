async function mountPage() {
  const wrapper = mount(DataEntryPage, { attachTo: document.body })
  await flushPromises()
  await flushPromises()
  return wrapper
}

fnTest(['M03.F03.I03'], '点击录入结果打开弹窗', async () => {
  const wrapper = await mountPage()
  const entryBtn = wrapper.findAll('button[data-fn="M03.F03.I03"]')[0]
  expect(entryBtn.exists()).toBe(true)
  await entryBtn.trigger('click')
  await flushPromises()
  expect(document.body.textContent).toContain('录入检测结果')
  expect(document.body.textContent).toContain('检测环境')
})