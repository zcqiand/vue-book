// 代码清单28-3: Pinia Store 测试 — createTestingPinia 隔离环境
// src/stores/user.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from './user'

describe('useUserStore', () => {
  // 每个测试前创建独立的 Pinia 实例，避免状态污染
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('初始状态 token 和 userInfo 为 null', () => {
    const store = useUserStore()
    expect(store.token).toBeNull()
    expect(store.userInfo).toBeNull()
    expect(store.isLoggedIn).toBe(false)
  })

  it('登录后 token 和 userInfo 填充', async () => {
    const store = useUserStore()

    // Mock fetch 实现
    const mockResponse = {
      ok: true,
      json: () =>
        Promise.resolve({
          token: 'abc-123-token',
          userInfo: { id: 1, name: 'Tom', avatar: 'https://example.com/avatar/tom.png' },
        }),
    }
    global.fetch = vi.fn().mockResolvedValue(mockResponse)

    await store.login('tom', 'password')

    expect(store.token).toBe('abc-123-token')
    expect(store.userInfo).toEqual({ id: 1, name: 'Tom', avatar: 'https://example.com/avatar/tom.png' })
    expect(store.isLoggedIn).toBe(true)
  })

  it('logout 后状态清除', async () => {
    const store = useUserStore()

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          token: 'xyz-token',
          userInfo: { id: 2, name: 'Jerry' },
        }),
    })

    await store.login('jerry', 'pass')
    expect(store.isLoggedIn).toBe(true)

    store.logout()

    expect(store.token).toBeNull()
    expect(store.userInfo).toBeNull()
    expect(store.isLoggedIn).toBe(false)
  })
})