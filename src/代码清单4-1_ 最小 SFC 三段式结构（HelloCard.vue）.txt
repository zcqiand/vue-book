<template>
  <div class="card">
    <h2>{{ title }}</h2>
    <p>{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const title = ref<string>('你好 Vue')
const message = ref<string>('这是我的第一个单文件组件')
</script>

<style scoped>
/* scoped 让样式只作用于当前组件，不会泄漏到其他组件 */
.card {
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}
</style>