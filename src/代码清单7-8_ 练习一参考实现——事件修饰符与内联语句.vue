<script setup lang="ts">
import { ref } from 'vue'

const count = ref<number>(0)
const log = ref<string[]>([])

function logClick(label: string): void {
  // ❶ 点击内层按钮时由于 .stop，事件不会冒泡到外层
  // 这里手动补一条日志，模拟「外层能感知内层点击」的效果
  log.value.push(`点击了 ${label}（时间：${new Date().toLocaleTimeString()}）`)
}

function reset(): void {
  count.value = 0
}
</script>

<template>
  <!-- ❷ 外层监听 @click，作为兜底日志入口 -->
  <div @click="logClick('外层')" style="padding: 24px; border: 1px solid #ccc">
    <h2>当前计数：{{ count }}</h2>

    <button @click="count++">+1</button>
    <button @click="count += 10">+10</button>
    <button @click="count--">-1</button>
    <button @click="reset">重置</button>

    <p>点击日志：</p>
    <ul>
      <li v-for="(item, idx) in log" :key="idx">{{ item }}</li>
    </ul>
  </div>
</template>