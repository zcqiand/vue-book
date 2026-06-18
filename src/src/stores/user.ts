// 代码清单35-1: Pinia 用户 store（JWT 登录态）
// src/stores/user.ts
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const userInfo = ref<{ id: number; name: string; role: string } | null>(null)

  const isLoggedIn = computed(() => !!token.value)
  const isAdmin = computed(() => userInfo.value?.role === 'admin')

  async function login(username: string, password: string): Promise<void> {
    const res = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }).then(r => r.json())
    token.value = res.token
    userInfo.value = res.userInfo
    localStorage.setItem('token', res.token)
  }

  function logout(): void {
    token.value = null
    userInfo.value = null
    localStorage.removeItem('token')
  }

  return { token, userInfo, isLoggedIn, isAdmin, login, logout }
})