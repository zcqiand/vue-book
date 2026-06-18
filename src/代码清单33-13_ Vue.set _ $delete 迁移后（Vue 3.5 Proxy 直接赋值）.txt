<script setup lang="ts">
import { reactive } from 'vue'

interface Profile {
  name: string
  age: number
  email?: string
  [key: string]: string | number | undefined
}

// reactive 返回 Proxy 代理：新增、删除属性都被代理拦截，自动触发更新
const profile = reactive<Profile>({
  name: 'Tom',
  age: 20
})

function addField(): void {
  // 直接赋值即可，无需 Vue.set：Proxy 的 set 拦截器自动通知依赖
  profile.email = 'tom@example.com'
}

function removeField(): void {
  // delete 运算符即可，无需 $delete：Proxy 的 deleteProperty 拦截器处理后续更新
  delete profile.age
}
</script>

<template>
  <pre>{{ profile }}</pre>
  <button @click="addField">添加 email</button>
  <button @click="removeField">删除 age</button>
</template>