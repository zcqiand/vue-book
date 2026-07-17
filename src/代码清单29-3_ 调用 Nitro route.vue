<script setup lang="ts">
const { data } = await useFetch('/api/hello')
</script>
<template>
  <div>{{ data?.message }}</div>
</template>