// 代码清单21-6: 反例——watchEffect 中发请求但没做清理
// src/components/WatchEffectCleanupDemo.vue
<script setup lang="ts">
import { ref, watchEffect, onCleanup } from 'vue'

interface User {
  id: number
  name: string
}

const userId = ref<number>(1)
const user = ref<User | null>(null)
const log = ref<string[]>([])

function appendLog(msg: string): void {
  log.value = [...log.value, `[${new Date().toLocaleTimeString()}] ${msg}`]
}

// ❌ 错误写法：watchEffect 中发请求，但组件卸载后仍在 setState
// 现象：组件卸载后，异步请求的回调仍会执行，导致 "setState in unmounted component" 警告
// 原因：watchEffect 没有返回清理函数，且没有用 onCleanup 注册清理逻辑
// watchEffect(() => {
//   const id = userId.value
//   appendLog(`watch: 开始请求用户 ${id}`)
//
//   // 模拟异步请求，延迟较长，组件可能在此期间卸载
//   const timer = window.setTimeout(() => {
//     user.value = { id, name: `用户${id}号` }
//     appendLog(`watch: 用户 ${id} 数据已到达`)
//
//     // 问题：如果组件已卸载，这里仍会执行 user.value = ...，
//     // Vue 会报 "setState in unmounted component" 警告
//   }, 2000)
//
//   // ❌ 缺失：没有取消 timer，没有 abort 请求
// })

// ✅ 正确写法：用 onCleanup 清理副作用
watchEffect(() => {
  const id = userId.value
  appendLog(`watch: 开始请求用户 ${id}`)

  const timer = window.setTimeout(() => {
    user.value = { id, name: `用户${id}号` }
    appendLog(`watch: 用户 ${id} 数据已到达`)
  }, 2000)

  // 在 onCleanup 中清理：组件卸载或 watchEffect 重新运行时执行
  onCleanup(() => {
    window.clearTimeout(timer)
    appendLog(`watch: 已清理用户 ${id} 的请求`)
  })
})

// 带 AbortController 的 fetch 清理示例
let controller: AbortController | null = null

watchEffect(() => {
  const id = userId.value
  controller?.abort()
  controller = new AbortController()

  appendLog(`watch: 开始 fetch 用户 ${id}`)

  const timeoutId = window.setTimeout(() => controller?.abort(), 5000)

  fetch(`/api/users/${id}`, { signal: controller.signal })
    .then((res) => res.json())
    .then((data: User) => {
      user.value = data
      appendLog(`watch: 用户 ${id} fetch 完成`)
    })
    .catch((err) => {
      if (err instanceof Error && err.name !== 'AbortError') {
        appendLog(`watch: fetch 失败 - ${err.message}`)
      }
    })

  onCleanup(() => {
    window.clearTimeout(timeoutId)
    controller?.abort()
    appendLog(`watch: 已 abort 用户 ${id} 的 fetch`)
  })
})
</script>

<template>
  <div class="p-4 space-y-4">
    <h3 class="font-semibold text-gray-800">watchEffect 清理演示</h3>

    <div class="flex gap-2">
      <button
        v-for="id in [1, 2, 3]"
        :key="id"
        @click="userId = id"
        class="px-3 py-1 rounded text-sm"
        :class="userId === id ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'"
      >
        切换到用户 {{ id }}
      </button>
    </div>

    <p v-if="user" class="font-medium text-gray-800">
      当前用户：{{ user.name }}
    </p>

    <div class="bg-gray-900 text-green-400 text-xs p-3 rounded font-mono max-h-40 overflow-y-auto">
      <p v-for="(line, i) in log" :key="i" class="whitespace-pre">{{ line }}</p>
    </div>
  </div>
</template>