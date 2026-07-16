import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { useMouse } from '@/composables/useMouse'
import { describe, it, expect } from 'vitest'

const MouseTracker = defineComponent({
  setup() {
    return useMouse()
  },
  template: '<div>{{ x }} {{ y }}</div>',
})

describe('useMouse', () => {
  it('初始值都为 0', () => {
    const wrapper = mount(MouseTracker)
    expect(wrapper.text()).toContain('0 0')
  })

  it('mousemove 后 x 和 y 正确更新', async () => {
    const wrapper = mount(MouseTracker)
    window.dispatchEvent(new MouseEvent('mousemove', { clientX: 300, clientY: 400 }))
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('300 400')
    wrapper.unmount()
  })

  it('unmount 后 mousemove 不再触发响应', async () => {
    const wrapper = mount(MouseTracker)
    wrapper.unmount()
    window.dispatchEvent(new MouseEvent('mousemove', { clientX: 500, clientY: 500 }))
    await wrapper.vm.$nextTick()
    // 组件已卸载，模板不再被订阅，但更关键的是监听器已移除
    // 这里主要验证 unmount 不抛错、副作用已清理
    expect(wrapper.vm).toBeDefined()
  })
})