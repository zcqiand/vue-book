<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'

const submitError = ref<string>('')

// 场景一：事件处理函数中的异步请求错误——用 try-catch 接
async function handleSubmit(): Promise<void> {
  submitError.value = ''
  try {
    const response = await fetch('/api/submit', {
      method: 'POST',
      body: JSON.stringify({ data: someData }),
    })
    if (!response.ok) {
      throw new Error(`提交失败：${response.status}`)
    }
    alert('提交成功！')
  } catch (err) {
    // try-catch 接住 await 语句的异步错误
    submitError.value = err instanceof Error ? err.message : '提交失败'
  }
}

// 场景二：后代组件渲染错误——用 onErrorCaptured 接
onErrorCaptured((err, _instance, _info) => {
  console.error('子组件渲染错误:', err)
  return false // 阻止冒泡
})
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <button type="submit">提交表单</button>
    <p v-if="submitError" class="error-msg">{{ submitError }}</p>
  </form>
</template>