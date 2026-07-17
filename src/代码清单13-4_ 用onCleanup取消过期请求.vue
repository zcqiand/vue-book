<script setup lang="ts">
import { ref, watch } from 'vue'

const keyword = ref<string>('')
const result = ref<string>('')
const loading = ref<boolean>(false)

watch(keyword, async (newKeyword, _oldKeyword, onCleanup) => {
  if (!newKeyword.trim()) {
    result.value = ''
    return
  }

  const controller = new AbortController()
  onCleanup(() => {
    controller.abort()
  })

  loading.value = true

  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(newKeyword)}`, {
      signal: controller.signal,
    })
    const data = await response.json()
    result.value = data.title
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return
    }
    result.value = '搜索失败，请稍后重试'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <input v-model="keyword" placeholder="输入关键词" />
    <p v-if="loading">搜索中...</p>
    <p v-else>{{ result }}</p>
  </div>
</template>