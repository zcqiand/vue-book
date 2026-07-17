<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCounterStore } from '@/stores/counter'

// 拿到 store 实例：调用 actions 不需要 .commit / .dispatch
const counterStore = useCounterStore()

// 解构 state 必须走 storeToRefs：直接解构会丢失响应式
const { count } = storeToRefs(counterStore)

function handleAsyncAdd(): void {
  // Pinia 的 actions 调用如同普通函数：参数直接传对象，无需 dispatch
  counterStore.incrementAsync(500)
}
</script>

<template>
  <!-- 模板里直接读 count.value 的 ref 解包结果 -->
  <div>
    <p>当前计数：{{ count }}</p>
    <button @click="counterStore.increment">+1</button>
    <button @click="handleAsyncAdd">异步 +1</button>
  </div>
</template>