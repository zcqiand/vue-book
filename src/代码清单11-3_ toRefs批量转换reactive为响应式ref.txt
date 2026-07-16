<script setup lang="ts">
import { reactive, toRefs } from 'vue'

interface UserProfile {
  name: string
  age: number
  email: string
  role: string
}

// 一步转换：toRefs 把整个 reactive 对象转成一组 ref
const state = reactive<UserProfile>({
  name: '张三',
  age: 28,
  email: 'zhang@example.com',
  role: 'admin',
})

// 批量解构 —— 每个变量都是 ref，模板自动解包
const { name, age, email, role } = toRefs(state)

function promote(): void {
  // toRefs 解构出的 ref 仍指向原始代理，修改 .value 即可触发视图更新
  role.value = 'superadmin'
}

function birthday(): void {
  age.value++
}

function updateEmail(newEmail: string): void {
  email.value = newEmail
}
</script>

<template>
  <div>
    <p>姓名：{{ name }}（年龄：{{ age }}）</p>
    <p>邮箱：{{ email }}</p>
    <p>角色：{{ role }}</p>

    <button @click="birthday">生日加一岁</button>
    <button @click="promote">晋升为超级管理员</button>
    <button @click="updateEmail('new@example.com')">换邮箱</button>
  </div>
</template>