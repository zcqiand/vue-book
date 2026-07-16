// src/stores/counter.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCounterStore = defineStore('counter', () => {
  // 用 ref 声明状态：类型推导精确为 number
  const count = ref<number>(0)

  // 同步方法直接写：原 mutations 的 increment / add 合并到这里
  function increment(): void {
    count.value++
  }

  function add(step: number): void {
    count.value += step
  }

  // 异步方法与同步方法位置等价：心智模型更简单，不再区分 mutations / actions
  function incrementAsync(delay = 0): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        count.value++
        resolve()
      }, delay)
    })
  }

  return { count, increment, add, incrementAsync }
})