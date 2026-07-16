<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'

const keyword = ref<string>('')
const dataList = ref<string[]>([
  'Vue 3 实战',
  'Vue Router 深入',
  'TypeScript 入门',
  'Pinia 状态管理',
  'Vite 快速入门',
])

// computed 版本：声明式派生，缓存由 Vue 自动管理
const filteredList = computed<string[]>(() => {
  console.count('computed filteredList')
  const kw = keyword.value.trim().toLowerCase()
  if (!kw) return dataList.value
  return dataList.value.filter((name) => name.toLowerCase().includes(kw))
})

// watchEffect 版本：命令式副作用，需要手动写入目标 ref
const filteredListEffect = ref<string[]>([])
watchEffect(() => {
  console.count('watchEffect')
  const kw = keyword.value.trim().toLowerCase()
  if (!kw) {
    filteredListEffect.value = dataList.value
  } else {
    filteredListEffect.value = dataList.value.filter((name) =>
      name.toLowerCase().includes(kw)
    )
  }
})

function setKeyword(value: string): void {
  keyword.value = value
}
</script>

<template>
  <div>
    <input
      :value="keyword"
      @input="setKeyword(($event.target as HTMLInputElement).value)"
      placeholder="输入关键词过滤"
      type="text"
    />

    <h3>computed 版本（推荐）</h3>
    <ul>
      <li v-for="item in filteredList" :key="item">{{ item }}</li>
    </ul>

    <h3>watchEffect 版本（命令式）</h3>
    <ul>
      <li v-for="item in filteredListEffect" :key="`e-${item}`">{{ item }}</li>
    </ul>

    <button @click="setKeyword('')">清空关键词</button>
  </div>
</template>