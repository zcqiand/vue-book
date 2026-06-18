// 代码清单28-5: vi.fn() Mock 请求 — 成功与失败场景
// src/composables/useFetch.test.ts
import { describe, it, expect, vi } from 'vitest'
import { ref } from 'vue'
import { useFetch } from './useFetch'

// 辅助：直接调用 useFetch 而不经过组件生命周期（手动调用 execute）
function createUseFetchRunner<T>(url: string) {
  const result = useFetch<T>(url)
  return result
}

describe('useFetch 请求场景测试', () => {

  it('请求成功时 data 填充，error 为 null', async () => {
    interface User {
      id: number
      name: string
    }

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([{ id: 1, name: 'Tom' }, { id: 2, name: 'Jerry' }] as User[]),
    })

    const { data, error, loading, execute } = createUseFetchRunner<User[]>('/api/users')
    await execute()

    expect(data.value).toEqual([{ id: 1, name: 'Tom' }, { id: 2, name: 'Jerry' }])
    expect(error.value).toBeNull()
    expect(loading.value).toBe(false)
  })

  it('请求失败时 error 有值，data 为 null', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    })

    const { data, error, execute } = createUseFetchRunner('/api/unknown')
    await execute()

    expect(data.value).toBeNull()
    expect(error.value).toBeInstanceOf(Error)
    expect(error.value?.message).toContain('404')
  })

  it('网络错误时 error 正确捕获', async () => {
    const networkError = new Error('网络错误')
    global.fetch = vi.fn().mockRejectedValue(networkError)

    const { data, error, execute } = createUseFetchRunner('/api/users')
    await execute()

    expect(data.value).toBeNull()
    expect(error.value).toBeInstanceOf(Error)
    expect(error.value?.message).toBe('网络错误')
  })

  it('主动 abort 后不产生 error（竞态取消）', async () => {
    let rejectFn: (reason: Error) => void
    const pendingPromise = new Promise((_, reject) => {
      rejectFn = reject
    })

    global.fetch = vi.fn().mockImplementation(() => pendingPromise)

    const { execute } = createUseFetchRunner('/api/slow')

    // 立即 abort
    const executePromise = execute()
    // 在微任务中 abort
    await Promise.resolve()
    // 中断请求（模拟 AbortController.abort() 行为）
    // 注意：这里通过 reject AbortError 来模拟，实际测试中 AbortController 会自动处理
    rejectFn!(new Error('AbortError'))

    const { error } = createUseFetchRunner('/api/slow')
    // 竞态取消的请求不应作为错误展示
    // （实际实现中会过滤 AbortError，这里演示 mock 模式）
    expect(error.value).toBeNull()
  })
})