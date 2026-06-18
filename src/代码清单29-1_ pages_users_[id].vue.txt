<script setup lang="ts">
const route = useRoute()
const userId = route.params.id as string
</script>
<template>
  <div>用户 ID：{{ userId }}</div>
</template>