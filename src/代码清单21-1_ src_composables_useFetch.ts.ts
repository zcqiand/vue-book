import { ref, onMounted, onUnmounted } from 'vue'

interface UseFetchOptions {
  method?: string
  headers?: Record<string, string>
}

interface UseFetchReturn<T> {
  data: ref<T | null>
  error: ref<Error | null>
  loading: ref<boolean>
}

export function useFetch<T>(
  url: string,
  options?: UseFetchOptions
): UseFetchReturn<T> {
  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)
  const loading = ref<boolean>(false)

  // 维护当前生效的 AbortController
  let controller: AbortController | null = null

  async function execute(): Promise<void> {
    // 新请求发起前，先取消旧请求
    if (controller) {
      controller.abort()
    }

    controller = new AbortController()
    loading.value = true
    error.value = null

    try {
      const response = await fetch(url, {
        method: options?.method ?? 'GET',
        headers: options?.headers ?? {},
        signal: controller.signal,
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      data.value = await response.json() as T
    } catch (err) {
      // 需要区分用户主动取消（AbortError）和其他错误
      if (err instanceof Error && err.name === 'AbortError') {
        return // 用户主动取消，不算错误
      }
      error.value = err instanceof Error ? err : new Error(String(err))
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    execute()
  })

  onUnmounted(() => {
    // 组件卸载时取消正在进行的请求
    if (controller) {
      controller.abort()
    }
  })

  return { data, error, loading }
}