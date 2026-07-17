<script setup lang="ts">
import { ref } from 'vue';

// ref<number>(0)：声明一个数字类型的响应式状态，初始值为 0
const count = ref<number>(0);
</script>

<template>
  <div class="counter-container">
    <!-- 模板里 ref 自动解包，直接写 count 即显示其值 -->
    <div class="count-display">{{ count }}</div>
    <div>
      <button @click="count--">-1</button>
      <!-- count++ 触发响应式更新，Vue 自动重渲染受影响的节点 -->
      <button @click="count++">+1</button>
    </div>
  </div>
</template>

<style scoped>
  .counter-container {
    text-align: center;
  }
  .count-display {
    font-size: 3rem;
    margin: 1rem 0;
  }
  button {
    font-size: 1.2rem;
    padding: 0.5rem 1.5rem;
    margin: 0 0.5rem;
    cursor: pointer;
  }
</style>