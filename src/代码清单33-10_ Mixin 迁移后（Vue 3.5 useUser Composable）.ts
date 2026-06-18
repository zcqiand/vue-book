// src/composables/useUser.ts
import { ref, computed } from 'vue'
import { http } from '@/utils/http'

export interface User {
  id: number
  name: string
  role: 'admin' | 'member' | 'guest'
}

export function useUser() {
  // 显式 ref 声明状态：调用方拿到的是 user.value，类型精确为 User | null
  // Mixin 时代这是模糊的 any，TS 检查形同虚设
  const user = ref<User | null>(null)
  const loading = ref<boolean>(false)
  const errorMessage = ref<string>('')

  const isAdmin = computed<boolean>(() => user.value?.role === 'admin')

  async function fetchUser(id: number): Promise<void> {
    loading.value = true
    errorMessage.value = ''
    try {
      const data = await http.get<User>(`/users/${id}`)
      user.value = data
    } catch (err) {
      // 错误信息外抛到响应式状态，调用方决定如何展示
      // 相比 Mixin 的隐式 console.log，Composable 让错误处理职责清晰
      errorMessage.value = err instanceof Error ? err.message : '获取用户失败'
    } finally {
      loading.value = false
    }
  }

  function logout(): void {
    user.value = null
  }

  // 显式 return：调用方通过解构拿到哪些字段一目了然
  // 命名冲突不可能发生：不同 Composable 返回的同名字段在解构时会被立即察觉
  return {
    user,
    loading,
    errorMessage,
    isAdmin,
    fetchUser,
    logout
  }
}