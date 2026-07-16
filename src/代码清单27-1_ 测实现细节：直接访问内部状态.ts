const wrapper = mount(Counter)
// 直接访问内部状态
const count = (wrapper.vm as any).count
expect(count).toBe(0)