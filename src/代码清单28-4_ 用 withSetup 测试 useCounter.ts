import { useCounter } from '@/composables/useCounter'
import { withSetup } from '@/test-utils/withSetup'
import { describe, it, expect } from 'vitest'

describe('useCounter', () => {
  it('初始值与 increment/decrement 行为', async () => {
    const [result, app] = withSetup(() => useCounter(0))
    const { count, increment, decrement } = result

    expect(count.value).toBe(0)
    increment()
    expect(count.value).toBe(1)
    increment()
    increment()
    expect(count.value).toBe(3)
    decrement()
    expect(count.value).toBe(2)

    app.unmount()
  })

  it('不允许负数（业务约束）', () => {
    const [result, app] = withSetup(() => useCounter(0))
    result.decrement()
    expect(result.count.value).toBe(0) // 业务约束：count 不小于 0
    app.unmount()
  })
})