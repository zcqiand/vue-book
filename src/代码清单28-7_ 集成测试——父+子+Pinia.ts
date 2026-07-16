import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { useListStore } from '@/stores/list'
import Parent from '@/components/Parent.vue'
import Sidebar from '@/components/Sidebar.vue'
import Content from '@/components/Content.vue'
import { describe, it, expect, beforeEach } from 'vitest'

describe('列表筛选集成测试', () => {
  beforeEach(() => {
    // createTestingPinia 默认 stub 所有 action
  })

  it('侧边栏输入筛选条件后，内容区列表同步更新', async () => {
    const wrapper = mount(Parent, {
      global: {
        plugins: [createTestingPinia({
          stubActions: false, // 允许 action 真正执行，便于端到端验证
        })],
      },
    })

    const store = useListStore()
    store.items = [
      { id: 1, name: 'Apple', category: 'fruit' },
      { id: 2, name: 'Carrot', category: 'vegetable' },
      { id: 3, name: 'Banana', category: 'fruit' },
      { id: 4, name: 'Broccoli', category: 'vegetable' },
    ]

    const sidebar = wrapper.findComponent(Sidebar)
    const content = wrapper.findComponent(Content)

    await sidebar.find('input').setValue('fruit')
    await sidebar.find('input').trigger('input')

    // 等待 store 更新 + 组件重渲染
    await wrapper.vm.$nextTick()

    const items = content.findAll('.list-item')
    expect(items).toHaveLength(2)
    expect(items[0].text()).toContain('Apple')
    expect(items[1].text()).toContain('Banana')
  })

  it('清空筛选条件后，所有项目可见', async () => {
    const wrapper = mount(Parent, {
      global: { plugins: [createTestingPinia({ stubActions: false })] },
    })

    const store = useListStore()
    store.items = [
      { id: 1, name: 'Apple', category: 'fruit' },
      { id: 2, name: 'Carrot', category: 'vegetable' },
    ]

    const sidebar = wrapper.findComponent(Sidebar)
    const content = wrapper.findComponent(Content)

    await sidebar.find('input').setValue('fruit')
    await wrapper.vm.$nextTick()
    expect(content.findAll('.list-item')).toHaveLength(1)

    await sidebar.find('input').setValue('')
    await wrapper.vm.$nextTick()
    expect(content.findAll('.list-item')).toHaveLength(2)
  })
})