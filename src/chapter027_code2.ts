const wrapper = mount(Counter)
expect(wrapper.text()).toContain('0')       // 检查初始文案
await wrapper.find('button').trigger('click')
expect(wrapper.text()).toContain('1')            // 检查点击后的文案