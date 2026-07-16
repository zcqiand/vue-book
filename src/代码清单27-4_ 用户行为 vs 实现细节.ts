// 反例：测实现细节
it('count 内部状态从 0 递增到 1', async () => {
  const wrapper = mount(Counter)
  await wrapper.find('button').trigger('click')
  expect((wrapper.vm as any).count).toBe(1)   // 绑定到内部变量名
})

// 正例：测用户行为
it('点击按钮后屏幕上的数字从 0 变成 1', async () => {
  const wrapper = mount(Counter)
  expect(wrapper.get('[data-test="count"]').text()).toBe('0')
  await wrapper.get('button').trigger('click')
  expect(wrapper.get('[data-test="count"]').text()).toBe('1')
})