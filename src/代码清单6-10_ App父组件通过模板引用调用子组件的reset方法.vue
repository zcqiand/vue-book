<script setup lang="ts">
import { useTemplateRef } from 'vue'
import EditableCounter from '@/components/EditableCounter.vue'

// useTemplateRef 是 Vue 3.5 引入的 API：参数 'counter' 对应模板里 ref="counter" 的字符串
// 返回的 counterRef.value 类型由 Vue 3.5 自动推断为 EditableCounter 暴露的接口（含 reset）或 null
const counterRef = useTemplateRef('counter')

function handleReset() {
  // 模板挂载前 .value 可能为 null，用可选链兜底，符合 strictNullChecks 要求
  counterRef.value?.reset()
}
</script>

<template>
  <div>
    <EditableCounter ref="counter" />
    <button type="button" @click="handleReset">外部重置</button>
  </div>
</template>