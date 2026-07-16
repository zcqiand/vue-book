import { createPinia } from 'pinia'
import { setActivePinia } from 'pinia/testing'
import { useUserStore } from '@/stores/user'
import { describe, it, expect, vi } from 'vitest'

describe('useUserStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('登录后 token 和 userInfo 填充', async () => {
    const store = useUserStore()
    expect(store.isLoggedIn).toBe(false)

    // mock fetch
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ token: 'abc', userInfo: { id: 1, name: 'Tom' } }),
    })

    await store.login('tom', 'password')
    expect(store.token).toBe('abc')
    expect(store.isLoggedIn).toBe(true)
  })

  it('logout 后状态清空', async () => {
    const store = useUserStore()
    store.token = 'mock-token'
    store.userInfo = { id: 1, name: 'Tom' }
    store.logout()
    expect(store.token).toBeNull()
    expect(store.isLoggedIn).toBe(false)
  })
})