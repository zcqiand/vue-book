import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import FormSubmit from './FormSubmit.vue'

describe('FormSubmit 组件', () => {
  it('提交时触发 submit 事件并传递 email', async () => {
    const wrapper = mount(FormSubmit)
    await wrapper.find('input').setValue('test@example.com')
    await wrapper.find('form').trigger('submit')
    expect(wrapper.emitted('submit')).toBeTruthy()
    const submitEvent = wrapper.emitted('submit')![0]
    expect(submitEvent).toEqual([{ email: 'test@example.com' }])
  })
})