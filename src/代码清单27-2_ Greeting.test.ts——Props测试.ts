import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Greeting from './Greeting.vue'

describe('Greeting 组件', () => {
  it('默认 props 显示默认内容', () => {
    const wrapper = mount(Greeting)
    expect(wrapper.text()).toContain('陌生人')
  })

  it('传入 name prop 显示对应内容', () => {
    const wrapper = mount(Greeting, {
      props: { name: '张三' },
    })
    expect(wrapper.text()).toContain('张三')
  })

  it('setProps 更新 props 后视图变化', async () => {
    const wrapper = mount(Greeting, { props: { name: '李四' } })
    await wrapper.setProps({ name: '王五' })
    expect(wrapper.text()).toContain('王五')
  })
})