<script setup lang="ts">
// Vue 3.5 新写法：解构时直接赋默认值
const {
  title = '默认文章标题',
  count = 0,
  tags = [] as string[],
} = defineProps<{
  title?: string
  count?: number
  tags?: string[]
}>()
</script>

<template>
  <article class="article-card">
    <h2>{{ title }}</h2>
    <p>阅读量：{{ count.toLocaleString() }}</p>
    <div class="tags">
      <span v-for="tag in tags" :key="tag" class="tag">{{ tag }}</span>
    </div>
  </article>
</template>