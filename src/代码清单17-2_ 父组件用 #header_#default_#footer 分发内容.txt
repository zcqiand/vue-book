<script setup lang="ts">
import Card from './Card.vue'
</script>

<template>
  <Card>
    <template #header>
      <div class="custom-header">
        <h2>用户管理</h2>
        <button class="btn-add">新增用户</button>
      </div>
    </template>

    <div class="user-list">
      <p>李明 - 前端工程师</p>
      <p>王芳 - 产品经理</p>
    </div>

    <template #footer>
      <span class="footer-text">共 2 条记录</span>
    </template>
  </Card>
</template>