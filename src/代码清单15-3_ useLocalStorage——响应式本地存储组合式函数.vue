import { ref, watch, type Ref } from 'vue'

export function useLocalStorage<T>(key: string, defaultValue: T): Ref<T> {
  // 从 localStorage 读取初值，若无则用默认值
  const stored = localStorage.getItem(key)
  const initial: T = stored !== null ? (JSON.parse(stored) as T) : defaultValue

  const state = ref<T>(initial)

  // 每次 ref 值变化时同步写回 localStorage
  watch(
    state,
    (newValue) => {
      localStorage.setItem(key, JSON.stringify(newValue))
    }
  )

  return state
}