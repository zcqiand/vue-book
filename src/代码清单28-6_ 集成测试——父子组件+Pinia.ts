import { mount } from '@vue/test-utils'
import { createTestingPinia } from 'pinia/testing'
import { useListStore } from '@/stores/list'
import Parent from '@/components/Parent.vue'
import Sidebar from '@/components/Sidebar.vue'
import Content from '@/components/Content.vue'
import { describe, it, expect } from 'vitest'

describe('列表筛选集成测试', () => {
  it('侧边栏输入筛选条件后，内容区列表同步更新', async () => {
    const wrapper = mount(Parent, {
      global: {
        plugins: [createTestingPinia()],
      },
    })

    const store = useListStore()
    store.items = [
      { id: 1, name: 'Apple', category: 'fruit' },
      { id: 2, name: 'Carrot', category: 'vegetable' },
      { id: 3, name: 'Banana', category: 'fruit' },
    ]

    const sidebar = wrapper.findComponent(Sidebar)
    const content = wrapper.findComponent(Content)

    await sidebar.find('input').setValue('fruit')
    await sidebar.find('input').trigger('input')

    const items = content.findAll('.list-item')
    expect(items).toHaveLength(2)
  })
})