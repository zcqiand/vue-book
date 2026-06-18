// 代码清单28-2: Composable 测试 — 测试宿主组件模式
// src/composables/useCounter.test.ts
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, ref } from 'vue'
import { useCounter } from './useCounter'

// 方式一：创建一个测试组件作为宿主
// 测试组件将 Composable 的返回值暴露到模板
const TestHost = defineComponent({
  setup() {
    const { count, doubled, increment, decrement, reset } = useCounter(10)
    // 通过 expose 让测试工具能访问 Composable 返回的方法
    return {
      count,
      doubled,
      increment,
      decrement,
      reset,
    }
  },
  template: `
    <div>
      <span id="count">{{ count }}</span>
      <span id="doubled">{{ doubled }}</span>
      <button id="inc" @click="increment">+</button>
      <button id="dec" @click="decrement">-</button>
      <button id="reset" @click="reset">Reset</button>
    </div>
  `,
})

// 方式二：直接测试 Composable 的返回值（无需模板）
it('useCounter 返回值类型正确', () => {
  const { count, doubled, increment, decrement, reset } = useCounter(0)
  expect(count.value).toBe(0)
  expect(doubled.value).toBe(0)
  increment()
  expect(count.value).toBe(1)
  expect(doubled.value).toBe(2)
})

it('useCounter 初始值正确', () => {
  const wrapper = mount(TestHost)
  expect(wrapper.text()).toContain('10')
  expect(wrapper.text()).toContain('20') // doubled = count * 2
})

it('increment 后 count 和 doubled 更新', async () => {
  const wrapper = mount(TestHost)
  expect(wrapper.find('#count').text()).toBe('10')
  expect(wrapper.find('#doubled').text()).toBe('20')

  await wrapper.find('#inc').trigger('click')
  expect(wrapper.find('#count').text()).toBe('11')
  expect(wrapper.find('#doubled').text()).toBe('22')
})

it('decrement 后 count 和 doubled 更新', async () => {
  const wrapper = mount(TestHost)
  await wrapper.find('#dec').trigger('click')
  expect(wrapper.find('#count').text()).toBe('9')
  expect(wrapper.find('#doubled').text()).toBe('18')
})

it('reset 恢复初始值', async () => {
  const wrapper = mount(TestHost)
  await wrapper.find('#inc').trigger('click')
  await wrapper.find('#inc').trigger('click')
  expect(wrapper.find('#count').text()).toBe('12')

  await wrapper.find('#reset').trigger('click')
  expect(wrapper.find('#count').text()).toBe('10')
  expect(wrapper.find('#doubled').text()).toBe('20')
})