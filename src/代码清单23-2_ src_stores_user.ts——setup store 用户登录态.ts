import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

interface UserInfo {
  id: number
  name: string
  email: string
}

export const useUserStore = defineStore('user', () => {
  // state
  const token = ref<string | null>(null)
  const userInfo = ref<UserInfo | null>(null)

  // getter（computed）
  const isLoggedIn = computed(() => !!token.value)

  // action（async function）
  async function login(username: string, password: string): Promise<void> {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    if (!response.ok) {
      throw new Error('登录失败，请检查用户名和密码')
    }

    const data = await response.json()
    token.value = data.token
    userInfo.value = data.userInfo
  }

  function logout(): void {
    token.value = null
    userInfo.value = null
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    login,
    logout,
  }
})