<script setup lang="ts">
import { ref } from 'vue';

// ref<string>('...')：声明一个字符串类型的响应式状态
const greeting = ref<string>('你好，Vue！');
</script>

<template>
  <div class="hello-container">
    <h1>{{ greeting }}</h1>
    <!-- 点击切换 greeting 的值，界面自动更新 -->
    <button @click="greeting = '你已经踏出了 Vue 的第一步！'">
      点击我
    </button>
  </div>
</template>

<style scoped>
  .hello-container {
    text-align: center;
    margin-top: 20vh;
  }
  button {
    font-size: 1.2rem;
    padding: 0.5rem 1.5rem;
    cursor: pointer;
  }
</style>