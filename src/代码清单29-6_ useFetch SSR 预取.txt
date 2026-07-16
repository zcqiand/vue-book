<script setup lang="ts">
const { data: articles } = await useFetch('/api/articles', {
  query: { page: 1, size: 20 },
})
</script>
<template>
  <ul>
    <li v-for="item in articles" :key="item.id">{{ item.title }}</li>
  </ul>
</template>