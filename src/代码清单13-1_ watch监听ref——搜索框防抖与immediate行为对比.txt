<script setup lang="ts">
import { ref, watch } from 'vue'

const keyword = ref<string>('')
const searchResults = ref<string[]>([])
const searchCount = ref<number>(0)

// 默认行为：keyword 变化后才执行回调，初始值不触发
// 新值和老值都会被传入回调签名
watch(keyword, (newVal: string, oldVal: string) => {
  searchCount.value++
  console.log(`[默认watch] 旧值:"${oldVal}" → 新值:"${newVal}"，第${searchCount.value}次搜索`)
  searchResults.value = newVal
    ? [`《${newVal}》第一章`, `《${newVal}》第二章`, `《${newVal}》结局`]
    : []
})

// immediate: true 时，组件创建时就执行一次回调
// 此时 oldVal 为 undefined，适用于「组件加载时需要基于当前值做初始化」的场景
watch(
  keyword,
  (newVal: string, oldVal: string | undefined) => {
    console.log(`[immediate] 旧值:${oldVal ?? '无'} → 新值:"${newVal}"`)
  },
  { immediate: true }
)

function clearKeyword(): void {
  keyword.value = ''
}
</script>

<template>
  <div>
    <input v-model="keyword" type="text" placeholder="输入关键词搜索" />
    <button @click="clearKeyword">清空</button>

    <p>搜索结果（第{{ searchCount }}次搜索）：</p>
    <ul>
      <li v-for="(book, idx) in searchResults" :key="idx">{{ book }}</li>
    </ul>
  </div>
</template>