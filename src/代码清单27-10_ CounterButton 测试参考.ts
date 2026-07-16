import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import CounterButton from './CounterButton.vue'

describe('CounterButton', () => {
  it('初始显示 start 的值', () => {
    const wrapper = mount(CounterButton, { props: { start: 10 } })
    expect(wrapper.get('[data-test="display"]').text()).toBe('10')
  })

  it('点击增加按钮按 step 递增', async () => {
    const wrapper = mount(CounterButton, { props: { start: 0, step: 2 } })
    await wrapper.get('[data-test="inc"]').trigger('click')
    expect(wrapper.get('[data-test="display"]').text()).toBe('2')
  })

  it('点击重置按钮回到 start', async () => {
    const wrapper = mount(CounterButton, { props: { start: 5 } })
    await wrapper.get('[data-test="inc"]').trigger('click')
    await wrapper.get('[data-test="reset"]').trigger('click')
    expect(wrapper.get('[data-test="display"]').text()).toBe('5')
  })

  it('数值变化时触发 update:modelValue', async () => {
    const wrapper = mount(CounterButton, { props: { start: 0 } })
    await wrapper.get('[data-test="inc"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[1]])
  })
})