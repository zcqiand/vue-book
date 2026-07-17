<script setup lang="ts">
import { reactive, computed } from 'vue'

interface UserProfile {
  firstName: string
  lastName: string
  age: number
  city: string
}

const state = reactive<UserProfile>({
  firstName: '孙',
  lastName: '七',
  age: 30,
  city: '深圳',
})

// computed 访问 state.firstName 和 state.lastName
// Vue 自动将这两个属性注册为依赖，属性变化时 fullName 缓存失效
const fullName = computed<string>(() => `${state.firstName} ${state.lastName}`)

// age 变化不影响 fullName，因为 fullName 的求值函数里没有读取 state.age
const ageGroup = computed<string>(() => {
  if (state.age < 18) return '未成年'
  if (state.age < 60) return '成年人'
  return '老年人'
})

function updateFirstName(): void {
  state.firstName = '孙明'
  // 修改 state.firstName，fullName 自动失效，ageGroup 不受影响
}

function updateAge(): void {
  state.age = 65
  // 修改 state.age，ageGroup 自动失效，fullName 不受影响
}

function logBoth(): void {
  console.log('fullName:', fullName.value, 'ageGroup:', ageGroup.value)
}
</script>

<template>
  <div>
    <p>姓名：{{ fullName }}</p>
    <p>年龄段：{{ ageGroup }}</p>

    <button @click="updateFirstName">改名</button>
    <button @click="updateAge">改年龄</button>
    <button @click="logBoth">打印验证（控制台看分项计数）</button>
  </div>
</template>