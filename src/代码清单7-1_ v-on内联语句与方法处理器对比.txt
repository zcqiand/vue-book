<script setup lang="ts">
import { ref } from 'vue'

const count = ref<number>(0)

// ❶ 方法处理器：把函数名直接传给 @click，不带括号
function handleClick(): void {
  count.value++
}

// ❷ 需要访问事件对象时，参数显式标注为 MouseEvent
function logEvent(e: MouseEvent): void {
  console.log('触发元素：', e.target)
  count.value++
}
</script>

<template>
  <!-- 内联语句：直接写表达式 -->
  <button @click="count++">内联语句：{{ count }}</button>

  <!-- 方法处理器：传函数引用，不带括号 -->
  <button @click="handleClick">方法处理器：{{ count }}</button>

  <!-- 内联调用方法并显式传入 $event -->
  <button @click="logEvent($event)">访问事件对象：{{ count }}</button>
</template>