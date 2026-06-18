// 代码清单21-1: useFetch Composable
// src/composables/useFetch.ts
import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export interface UseFetchOptions {
  /** 请求超时毫秒数，默认 10000 */
  timeout?: number
}

export interface UseFetchReturn<T> {
  /** 请求成功时的响应数据，loading 时为 null */
  data: Ref<T | null>
  /** 请求失败时的错误信息，成功和 loading 时为 null */
  error: Ref<Error | null>
  /** 当前是否处于请求中状态 */
  loading: Ref<boolean>
  /** 手动触发请求（可用于重试） */
  execute: () => Promise<void>
}

/**
 * 泛型 Composable：包装 fetch，统一管理 loading / error / data 三态。
 * - 在 onMounted 发请求，onUnmounted 用 AbortController abort 取消旧请求
 * - 竞态处理：新请求发起前先 abort 旧请求
 *
 * @example
 * const { data, error, loading, execute } = useFetch<User[]>('/api/users')
 */
function useFetch<T>(url: string, options?: UseFetchOptions): UseFetchReturn<T> {
  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)
  const loading = ref<boolean>(false)

  // 每次请求共享同一个 AbortController，新请求前先 abort 旧请求
  let controller: AbortController | null = null

  async function execute(): Promise<void> {
    // ❶ 竞态处理：若已有进行中的请求，先取消
    if (controller) {
      controller.abort()
    }
    controller = new AbortController()

    loading.value = true
    error.value = null
    data.value = null

    try {
      // ❷ 超时控制：通过 Promise.race 实现
      const timeout = options?.timeout ?? 10000
      const timeoutId = window.setTimeout(() => controller?.abort(), timeout)

      const response = await fetch(url, {
        signal: controller.signal,
      })
      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const json: T = await response.json()
      data.value = json
    } catch (err) {
      // 过滤 AbortError（主动取消不当作错误展示）
      if (err instanceof Error && err.name === 'AbortError') {
        return
      }
      error.value = err instanceof Error ? err : new Error(String(err))
    } finally {
      if (controller !== null) {
        loading.value = false
      }
    }
  }

  onMounted(execute)

  onUnmounted(() => {
    // ❸ 组件卸载时取消未完成的请求，防止 setState in unmounted component
    controller?.abort()
  })

  return { data, error, loading, execute }
}

export { useFetch }