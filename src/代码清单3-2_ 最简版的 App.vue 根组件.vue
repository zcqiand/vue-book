<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}
</script>

<template>
  <div class="app">
    <h1>我的第一个 Vue 项目</h1>
    <p>当前计数：{{ count }}</p>
    <button @click="increment">点我 +1</button>
  </div>
</template>

<style scoped>
.app {
  font-family: sans-serif;
  text-align: center;
  margin-top: 40px;
}
</style>