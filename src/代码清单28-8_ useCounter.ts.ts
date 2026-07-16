import { ref } from 'vue'

export function useCounter(initial = 0, min = 0, max = Infinity) {
  const count = ref(initial)

  function increment() {
    if (count.value < max) count.value++
  }

  function decrement() {
    if (count.value > min) count.value--
  }

  function reset() {
    count.value = initial
  }

  return { count, increment, decrement, reset }
}