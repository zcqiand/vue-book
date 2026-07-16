import { ref, watchEffect, onUnmounted, type Ref } from 'vue'

export interface User {
  id: number
  name: string
  email: string
}

export function useUser(id: Ref<number>) {
  const data = ref<User | null>(null) as Ref<User | null>
  const loading = ref<boolean>(false)
  const error = ref<Error | null>(null)
  let controller: AbortController | null = null

  watchEffect(async () => {
    // 取消上一次请求，避免竞态
    controller?.abort()
    controller = new AbortController()
    loading.value = true
    error.value = null
    try {
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/users/${id.value}`,
        { signal: controller.signal }
      )
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      data.value = (await res.json()) as User
    } catch (e) {
      if ((e as Error).name !== 'AbortError') {
        error.value = e as Error
      }
    } finally {
      loading.value = false
    }
  })

  onUnmounted(() => {
    controller?.abort()
  })

  return { data, loading, error }
}