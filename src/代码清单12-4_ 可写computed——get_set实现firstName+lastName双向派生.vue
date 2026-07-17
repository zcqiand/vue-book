<script setup lang="ts">
import { ref, computed } from 'vue'

const firstName = ref<string>('赵')
const lastName = ref<string>('六')

// 可写 computed：get 读取两个 ref，set 拆分写入两个 ref
// 外部只需修改 fullName.value = '钱 七'，内部自动同步到 firstName/lastName
const fullName = computed<string>({
  get(): string {
    return `${firstName.value} ${lastName.value}`
  },
  set(newValue: string): void {
    // 将 '钱 七' 按空格拆分为两部分，分别写回原始 ref
    const parts = newValue.split(' ')
    if (parts.length >= 2) {
      firstName.value = parts[0]
      lastName.value = parts.slice(1).join(' ') // 防止中间名带空格
    } else if (parts.length === 1) {
      // 只有姓没有名时，保留原 lastName
      firstName.value = parts[0]
    }
  },
})

function applyDefault(): void {
  fullName.value = '张三'
}

function applyCustom(custom: string): void {
  fullName.value = custom
}

function logCurrent(): void {
  console.log('firstName:', firstName.value, 'lastName:', lastName.value)
}
</script>

<template>
  <div>
    <p>姓：{{ firstName }}</p>
    <p>名：{{ lastName }}</p>
    <p>全名（computed）：{{ fullName }}</p>

    <input v-model="fullName" type="text" placeholder="直接编辑全名" />
    <!-- v-model 双向绑定可写 computed，输入即触发 set -->

    <button @click="applyDefault">重置为张三</button>
    <button @click="applyCustom('钱七')">改为钱七</button>
    <button @click="logCurrent">打印到控制台验证</button>
  </div>
</template>