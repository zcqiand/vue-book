<script setup lang="ts">
import UserCard from '@/components/UserCard.vue'

const cardTitle = '当前用户'
const currentUser = { name: '张三', age: 28 }
</script>

<template>
  <!-- 字符串 prop 直接写；对象 prop 用冒号绑定 JS 表达式 -->
  <UserCard :title="cardTitle" :user="currentUser" />
</template>