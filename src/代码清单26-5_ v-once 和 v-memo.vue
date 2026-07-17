<script setup lang="ts">
import { ref } from 'vue'
const appTitle = ref('我的应用')
const items = ref([
  { id: 1, name: '项目A', status: 'active' },
  { id: 2, name: '项目B', status: 'inactive' },
])
</script>

<template>
  <!-- v-once：静态标题，渲染一次后不再更新 -->
  <h1 v-once>{{ appTitle }}</h1>

  <!-- v-memo：大列表，只在依赖数组变化时重渲染 -->
  <div
    v-for="item in items"
    :key="item.id"
    v-memo="[item.id, item.status]"
  >
    <span>{{ item.name }}</span>
    <span :class="item.status">{{ item.status }}</span>
    <!-- item.name 变化不会重新渲染此 div，只有 id 或 status 变化才会 -->
  </div>
</template>