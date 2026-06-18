// src/stores/user.options.ts
import { defineStore } from 'pinia'

interface UserInfo {
  id: number
  username: string
  avatar?: string
}

export const useUserStore = defineStore('user', {
  // state：函数形式返回初始状态
  state: () => ({
    token: null as string | null,
    userInfo: null as UserInfo | null,
  }),

  // getters：对象形式，this 指向 store 实例
  getters: {
    isLoggedIn(): boolean {
      return !!this.token
    },
  },

  // actions：可以是同步或异步函数
  actions: {
    async login(username: string, password: string): Promise<void> {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        throw new Error('登录失败，请检查用户名和密码')
      }

      const data = await response.json() as { token: string; user: UserInfo }
      this.token = data.token
      this.userInfo = data.user
    },

    logout(): void {
      this.token = null
      this.userInfo = null
    },
  },
})