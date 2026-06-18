// src/components/Parent.test.ts
import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import Parent from './Parent.vue'

describe('Parent', () => {
  it('只渲染当前组件，子组件被 stub 替换', () => {
    // Parent 依赖一个 HeavyChart 子组件
    // 用 shallowMount 避免加载它，防止测试受 HeavyChart 内部状态影响
    const wrapper = shallowMount(Parent)
    // Parent 的自身行为被隔离测试
    expect(wrapper.find('.parent-content').exists()).toBe(true)
    // 子组件未被实例化（被替换为 stub）
    expect(wrapper.find('heavy-chart').exists()).toBe(false)
  })
})