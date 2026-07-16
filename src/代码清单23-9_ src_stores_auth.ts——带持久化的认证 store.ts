import { defineStore } from 'pinia'

interface UserProfile {
  id: number
  name: string
}

const TOKEN_KEY = 'app_token'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // 初始化时从 localStorage 恢复，实现刷新不丢登录态
    token: localStorage.getItem(TOKEN_KEY),
    profile: null as UserProfile | null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
  },

  actions: {
    async login(username: string, password: string) {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      if (!res.ok) throw new Error('登录失败')

      const data = await res.json()
      // 更新 state 的同时写入 localStorage
      this.token = data.token
      this.profile = data.profile
      localStorage.setItem(TOKEN_KEY, data.token)
    },

    logout() {
      // $reset() 把 state 恢复到 state() 的初始返回值
      this.$reset()
      // localStorage 需手动清理，$reset 不会碰它
      localStorage.removeItem(TOKEN_KEY)
    },
  },
})