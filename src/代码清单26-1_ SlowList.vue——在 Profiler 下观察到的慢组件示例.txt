<script setup lang="ts">
import { ref } from 'vue'

interface Row {
  id: number
  name: string
  status: string
}

// 反例：未优化的列表——Profiler 会显示每次响应式更新都重渲染全部 500 行
const list = ref<Row[]>([])

async function loadAll(): Promise<void> {
  // 模拟一次性拉 500 行
  const res = await fetch('/api/rows?page=1&pageSize=500')
  const data: Row[] = await res.json()
  list.value = data
}

function shuffle(): void {
  // 触发整列重渲染：Vue 不会管哪行真的变了
  list.value = [...list.value].reverse()
}
</script>

<template>
  <div class="slow-list">
    <button @click="loadAll">加载 500 行</button>
    <button @click="shuffle">翻转列表（观察 Profiler）</button>

    <!-- 这一行 v-for 在 Profiler 里会出现 500 个 Patch 事件 -->
    <div v-for="row in list" :key="row.id" class="row">
      {{ row.name }} — {{ row.status }}
    </div>
  </div>
</template>