<script setup lang="ts">
import UserInfoCard from './UserInfoCard.vue'

// 复用与子组件 defineProps 一致的 UserInfo 结构，让传入数据被类型约束
interface UserInfo {
  id: number
  name: string
  role: string
  avatar: string
  isVip: boolean
}

const member: UserInfo = {
  id: 1,
  name: '张三',
  role: '前端工程师',
  avatar: 'https://picsum.photos/seed/zhangsan/56',
  isVip: true,
}
</script>

<template>
  <UserInfoCard :user="member" />
</template>