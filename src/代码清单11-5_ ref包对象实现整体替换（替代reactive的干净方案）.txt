<script setup lang="ts">
import { ref } from 'vue'

interface Article {
  id: number
  title: string
  status: 'draft' | 'published' | 'archived'
}

// ref 包对象：既能改单个字段，也能整体替换为新对象
const article = ref<Article>({
  id: 1,
  title: 'Vue 3 响应式原理',
  status: 'draft',
})

function publish(): void {
  // 整体替换：把 .value 指向全新对象，模板绑定自动刷新
  article.value = {
    id: article.value.id,
    title: article.value.title,
    status: 'published',
  }
}

function archive(): void {
  article.value = {
    ...article.value,
    status: 'archived',
  }
}

function reset(): void {
  // 重置回草稿：整体替换为初始状态
  article.value = {
    id: 1,
    title: 'Vue 3 响应式原理',
    status: 'draft',
  }
}
</script>

<template>
  <div>
    <p>文章ID：{{ article.id }}</p>
    <p>标题：{{ article.title }}</p>
    <p>状态：{{ article.status }}</p>

    <button @click="publish" :disabled="article.status !== 'draft'">发布</button>
    <button @click="archive" :disabled="article.status === 'archived'">归档</button>
    <button @click="reset">重置</button>
  </div>
</template>