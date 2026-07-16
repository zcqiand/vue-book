import { vi, beforeEach, afterEach } from 'vitest'
import { flushPromises } from '@vue/test-utils'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

it('点击防抖按钮 500ms 后才触发回调', async () => {
  const onSubmit = vi.fn()
  const wrapper = mount(DebouncedButton, { props: { onSubmit } })
  await wrapper.find('button').trigger('click')
  expect(onSubmit).not.toHaveBeenCalled()        // 还没到 500ms
  vi.advanceTimersByTime(500)                    // 时间快进 500ms
  await flushPromises()                          // 等微任务队列清空
  expect(onSubmit).toHaveBeenCalledTimes(1)
})