<script setup lang="ts">
const { data } = await useFetch('/api/time')
</script>
<template>
  <div>
    <h1>首页</h1>
    <p>服务器时间：{{ data?.now }}</p>
    <NuxtLink to="/about">关于</NuxtLink>
  </div>
</template>