import { ref, watch, type Ref } from 'vue'

export function useDebounceFn<T>(fn: (v: T) => void | Promise<void>, delay = 500) {
  const timer = ref<number | null>(null)
  const debounced = (v: T) => {
    if (timer.value) window.clearTimeout(timer.value)
    timer.value = window.setTimeout(() => fn(v), delay)
  }
  // 组件卸载时清理未触发的 timer，避免内存泄漏
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
      if (timer.value) window.clearTimeout(timer.value)
    })
  }
  return debounced
}