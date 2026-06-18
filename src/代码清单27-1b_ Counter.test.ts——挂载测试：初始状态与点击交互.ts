// src/components/Counter.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Counter from './Counter.vue'

describe('Counter', () => {
  it('初始显示计数为 0', () => {
    const wrapper = mount(Counter)
    expect(wrapper.text()).toContain('计数：0')
  })

  it('点击按钮后计数增加', async () => {
    const wrapper = mount(Counter)
    await wrapper.find('button').trigger('click')
    expect(wrapper.text()).toContain('计数：1')
  })
})