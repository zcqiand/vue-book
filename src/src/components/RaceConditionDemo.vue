// 代码清单21-5: 反例——竞态导致旧响应覆盖新数据
// src/components/RaceConditionDemo.vue
<script setup lang="ts">
import { ref } from 'vue'

interface User {
  id: number
  name: string
}

const currentPage = ref<number>(1)
const user = ref<User | null>(null)
const requestInfo = ref<string>('')

// ❌ 错误写法：无竞态处理，快速切换页码时旧请求晚于新请求返回
// 现象：用户切到第2页，但最终显示的是第1页的数据
async function fetchUserBroken(page: number): Promise<void> {
  requestInfo.value = `请求第 ${page} 页...`

  // 模拟不同网络延迟：页码越大延迟越短，故意制造竞态
  const delay = (3 - page) * 800
  await new Promise((resolve) => setTimeout(resolve, delay))

  // 问题：这里没有 AbortController，即使新请求已发出，旧请求的
  // 结果仍会覆盖新数据。假设：
  //  1. 用户点第2页，发出请求A（延迟1600ms）
  //  2. 用户立刻点第3页，发出请求B（延迟800ms）
  //  3. B 先返回，设置 user = 第3页数据
  //  4. A 后返回，覆盖 user = 第1页数据（此时用户看到的不是第3页！）
  user.value = { id: page, name: `用户${page}号` }
  requestInfo.value += ` 第${page}页数据已加载`
}

// ✅ 正确写法：用 AbortController abort 旧请求
let controller: AbortController | null = null

async function fetchUserFixed(page: number): Promise<void> {
  // 新请求前先 abort 旧请求
  controller?.abort()
  controller = new AbortController()

  requestInfo.value = `请求第 ${page} 页...`

  try {
    const delay = (3 - page) * 800
    await new Promise((resolve) => setTimeout(resolve, delay))
    user.value = { id: page, name: `用户${page}号` }
    requestInfo.value += ` 第${page}页数据已加载`
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      requestInfo.value += '（请求已取消）'
    }
  }
}
</script>

<template>
  <div class="p-4 space-y-4">
    <h3 class="font-semibold text-gray-800">竞态条件演示</h3>
    <p class="text-sm text-gray-500">快速切换页码，观察旧请求覆盖新数据的问题</p>

    <div class="flex gap-2">
      <button
        v-for="p in [1, 2, 3]"
        :key="p"
        @click="fetchUserBroken(p)"
        class="px-3 py-1 bg-red-100 hover:bg-red-200 rounded text-sm"
      >
        错误：请求第{{ p }}页
      </button>
    </div>

    <div class="flex gap-2">
      <button
        v-for="p in [1, 2, 3]"
        :key="p"
        @click="fetchUserFixed(p)"
        class="px-3 py-1 bg-green-100 hover:bg-green-200 rounded text-sm"
      >
        正确：请求第{{ p }}页
      </button>
    </div>

    <p class="text-sm text-gray-600">{{ requestInfo }}</p>
    <p v-if="user" class="font-medium text-gray-800">
      当前用户：{{ user.name }}（ID: {{ user.id }}）
    </p>
  </div>
</template>