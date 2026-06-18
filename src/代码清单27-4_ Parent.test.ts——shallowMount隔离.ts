import { shallowMount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Parent from './Parent.vue'

describe('Parent 组件', () => {
  it('只测试 Parent 自身行为，不被子组件加载干扰', () => {
    // shallowMount：子组件被 stub，不执行真实逻辑，不发请求
    const wrapper = shallowMount(Parent)
    expect(wrapper.find('h1').text()).toContain('Parent Title')
  })
})