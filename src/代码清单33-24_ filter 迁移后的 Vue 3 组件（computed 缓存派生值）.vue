<script setup lang="ts">
import { ref, computed } from 'vue'

const price = ref<number>(12.5)
const quantity = ref<number>(3)

// 单值格式化：依赖一个响应式数据，用 computed 缓存
const displayPrice = computed<string>(() => formatCurrency(price.value))

// 需要在 JS 里直接调用、或接收额外参数时，用普通方法
function formatCurrency(value: number): string {
  if (!Number.isFinite(value)) return '¥0.00'
  return '¥' + value.toFixed(2)
}
</script>

<template>
  <p>单价：{{ displayPrice }}</p>
  <p>总价：{{ formatCurrency(price * quantity) }}</p>
</template>