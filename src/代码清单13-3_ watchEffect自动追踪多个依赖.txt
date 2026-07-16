<script setup lang="ts">
import { ref, watchEffect } from 'vue'

const bookTitle = ref<string>('Vue入门指南')
const page = ref<number>(1)
const theme = ref<'light' | 'dark'>('light')

watchEffect(() => {
  console.log(`正在阅读《${bookTitle.value}》第 ${page.value} 页`)
})

function nextPage(): void {
  page.value++
}

function changeBook(): void {
  bookTitle.value = 'TypeScript实战'
}

function toggleTheme(): void {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}
</script>

<template>
  <div :class="theme">
    <h3>{{ bookTitle }}</h3>
    <p>当前页码：{{ page }}</p>

    <button @click="nextPage">下一页</button>
    <button @click="changeBook">换书</button>
    <button @click="toggleTheme">切换主题</button>
  </div>
</template>