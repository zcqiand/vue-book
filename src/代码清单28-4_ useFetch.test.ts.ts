import { describe, it, expect, vi } from 'vitest'

it('请求成功时 data 填充', async () => {
  const mockFetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve([{ id: 1, name: 'Tom' }]),
  })
  global.fetch = mockFetch
  const { data, error, loading } = useFetch<User[]>('/api/users')
  await new Promise(r => setTimeout(r, 10))
  expect(data.value).toHaveLength(1)
})

it('请求失败时 error 填充', async () => {
  global.fetch = vi.fn().mockRejectedValue(new Error('网络错误'))
  const { error } = useFetch<User[]>('/api/users')
  await new Promise(r => setTimeout(r, 10))
  expect(error.value).not.toBeNull()
})