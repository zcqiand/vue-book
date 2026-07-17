<script setup lang="ts">
// Layout.vue —— 不消费任何 provide/inject，保持「快递员」身份
import Sidebar from './Sidebar.vue'
import Content from './Content.vue'
</script>

<template>
  <div class="layout">
    <Sidebar />
    <Content />
  </div>
</template>