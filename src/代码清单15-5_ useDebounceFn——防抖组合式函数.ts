import { onUnmounted } from 'vue'

// 用参数元组 Args extends unknown[] 来推导 fn 的参数与返回类型，
// 相比 T extends (...args: unknown[]) => unknown 在 strictFunctionTypes 下
// 也能直接接受形如 (kw: string) => void 的回调
export function useDebounceFn<Args extends unknown[]>(
  fn: (...args: Args) => void,
  delay: number
): (...args: Args) => void {
  let timer: ReturnType<typeof setTimeout> | null = null

  onUnmounted(() => {
    // 组件卸载时清除残留定时器，防止内存泄漏
    if (timer !== null) {
      clearTimeout(timer)
    }
  })

  return function (...args: Args): void {
    if (timer !== null) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn(...args)
      timer = null
    }, delay)
  }
}