<script setup lang="ts">
// 错误示范：setup 顶层读 window，SSR 抛错
const currentPath = window.location.pathname
const now = new Date().toLocaleString()
</script>

<template>
  <div>
    <p>当前路径：{{ currentPath }}</p>
    <p>当前时间：{{ now }}</p>
  </div>
</template>