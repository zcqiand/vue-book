import { vi } from 'vitest'

vi.mock('axios', () => ({
  default: {
    get: vi.fn().mockResolvedValue({
      data: [{ id: 1, name: 'Alice' }]
    })
  }
}))