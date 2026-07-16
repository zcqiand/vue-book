<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue'

const fontSize = ref<number>(16)
const theme = ref<'light' | 'dark'>('light')
const currentPage = ref<number>(1)
const hydrated = ref<boolean>(false)

// 首次进入：立刻把 localStorage 里的偏好回填到响应式状态
watch(
  () => hydrated.value,
  () => {
    const raw = localStorage.getItem('reader-pref')
    if (raw) {
      const pref = JSON.parse(raw) as {
        fontSize: number
        theme: 'light' | 'dark'
        currentPage: number
      }
      fontSize.value = pref.fontSize
      theme.value = pref.theme
      currentPage.value = pref.currentPage
    }
    hydrated.value = true
  },
  { immediate: true }
)

// 后续变化：自动收集依赖，写回 localStorage
watchEffect(() => {
  if (!hydrated.value) return
  localStorage.setItem(
    'reader-pref',
    JSON.stringify({
      fontSize: fontSize.value,
      theme: theme.value,
      currentPage: currentPage.value,
    })
  )
})

function bigger(): void {
  fontSize.value += 2
}

function toggleTheme(): void {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

function nextPage(): void {
  currentPage.value++
}
</script>

<template>
  <div :data-theme="theme" :style="{ fontSize: fontSize + 'px' }">
    <p>字号：{{ fontSize }}px</p>
    <p>主题：{{ theme }}</p>
    <p>当前页：{{ currentPage }}</p>
    <button @click="bigger">字号 +2</button>
    <button @click="toggleTheme">切换主题</button>
    <button @click="nextPage">下一页</button>
  </div>
</template>