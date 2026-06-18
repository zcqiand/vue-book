import { useCounter } from '@/composables/useCounter'

it('useCounter 初始值为 0，increment 后为 1', async () => {
  const [result, app] = withSetup(() => useCounter(0))
  const { count, increment } = result
  expect(count.value).toBe(0)
  increment()
  expect(count.value).toBe(1)
  app.unmount()
})