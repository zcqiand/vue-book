<script setup lang="ts">
import { reactive, ref, watch } from 'vue'

interface CourseSettings {
  basic: {
    title: string
    level: 'beginner' | 'intermediate' | 'advanced'
  }
  display: {
    theme: 'light' | 'dark'
    showSidebar: boolean
  }
}

const settings = reactive<CourseSettings>({
  basic: {
    title: 'Vue 3 实战',
    level: 'beginner',
  },
  display: {
    theme: 'light',
    showSidebar: true,
  },
})

const deepHits = ref<number>(0)
const basicHits = ref<number>(0)
const displayHits = ref<number>(0)

// 方案 A：deep 监听整个对象——任意嵌套字段变化都会触发
watch(
  settings,
  () => {
    deepHits.value++
  },
  { deep: true }
)

// 方案 B：精确 getter——只关心 basic.title
watch(
  () => settings.basic.title,
  () => {
    basicHits.value++
  }
)

// 方案 C：精确 getter——只关心 display.theme
watch(
  () => settings.display.theme,
  () => {
    displayHits.value++
  }
)

function renameTitle(): void {
  settings.basic.title += '!'
}

function toggleSidebar(): void {
  settings.display.showSidebar = !settings.display.showSidebar
}

function toggleTheme(): void {
  settings.display.theme = settings.display.theme === 'light' ? 'dark' : 'light'
}
</script>

<template>
  <div>
    <p>标题：{{ settings.basic.title }}</p>
    <p>主题：{{ settings.display.theme }}</p>
    <p>侧边栏：{{ settings.display.showSidebar ? '显示' : '隐藏' }}</p>

    <p>deep 触发次数：{{ deepHits }}</p>
    <p>basic.title 触发次数：{{ basicHits }}</p>
    <p>display.theme 触发次数：{{ displayHits }}</p>

    <button @click="renameTitle">改标题</button>
    <button @click="toggleSidebar">切换侧边栏</button>
    <button @click="toggleTheme">切换主题</button>
  </div>
</template>