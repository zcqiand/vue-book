<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div id="layout">
    <!-- RouterView 是路由出口：当前 URL 匹配到的页面组件会渲染在这里 -->
    <RouterView />
  </div>
</template>

<style scoped>
#layout {
  font-family: system-ui, sans-serif;
  min-height: 100vh;
}
</style>