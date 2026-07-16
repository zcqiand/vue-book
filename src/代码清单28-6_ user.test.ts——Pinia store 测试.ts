import { createPinia, setActivePinia } from 'pinia'
import { useUserStore } from '@/stores/user'
import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('useUserStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('初始状态未登录', () => {
    const store = useUserStore()
    expect(store.isLoggedIn).toBe(false)
    expect(store.token).toBeNull()
    expect(store.userInfo).toBeNull()
  })

  it('登录成功后 token 和 userInfo 填充', async () => {
    // mock fetch，避免真实发请求
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        token: 'mock-token-abc',
        userInfo: { id: 1, name: 'Tom' },
      }),
    })

    const store = useUserStore()
    await store.login('tom', 'password')

    expect(store.token).toBe('mock-token-abc')
    expect(store.userInfo).toEqual({ id: 1, name: 'Tom' })
    expect(store.isLoggedIn).toBe(true)
  })

  it('登录失败时不应写入 token', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ message: '密码错误' }),
    })

    const store = useUserStore()
    // 业务实现里若未抛错，这里至少验证 token 仍是 null
    try {
      await store.login('tom', 'wrong-password')
    } catch {
      // 允许业务层抛错
    }
    expect(store.token).toBeNull()
  })

  it('logout 后状态清空', () => {
    const store = useUserStore()
    // 直接写状态模拟已登录
    store.token = 'mock-token'
    store.userInfo = { id: 1, name: 'Tom' }
    expect(store.isLoggedIn).toBe(true)

    store.logout()
    expect(store.token).toBeNull()
    expect(store.userInfo).toBeNull()
    expect(store.isLoggedIn).toBe(false)
  })
})