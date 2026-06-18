// src/stores/user.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 用户信息类型定义
interface UserInfo {
  id: number
  username: string
  avatar?: string
}

export const useUserStore = defineStore('user', () => {
  // state：用 ref 声明响应式状态
  const token = ref<string | null>(null)
  const userInfo = ref<UserInfo | null>(null)

  // getters：用 computed 声明派生状态
  const isLoggedIn = computed(() => !!token.value)

  // actions：普通函数，可含异步逻辑
  async function login(username: string, password: string): Promise<void> {
    // 实际项目中应替换为真实 API 调用
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    if (!response.ok) {
      throw new Error('登录失败，请检查用户名和密码')
    }

    const data = await response.json() as { token: string; user: UserInfo }
    token.value = data.token
    userInfo.value = data.user
  }

  function logout(): void {
    token.value = null
    userInfo.value = null
  }

  // 返回的对象即 store 对外暴露的内容
  return {
    token,
    userInfo,
    isLoggedIn,
    login,
    logout,
  }
})