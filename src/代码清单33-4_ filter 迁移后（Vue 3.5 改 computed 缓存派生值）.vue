<script setup lang="ts">
import { ref, computed } from 'vue'

const price = ref<number>(12.5)
const quantity = ref<number>(3)

// computed 缓存：只要 price/quantity 不变，多次读取 totalCost 不会重复计算
// filter 时代每次模板重渲染都重新执行，computed 在依赖未变时直接返回缓存值
const totalCost = computed<number>(() => price.value * quantity.value)

// 单值格式化：依赖单一响应式数据且需缓存，继续用 computed
const displayPrice = computed<string>(() => formatCurrency(price.value))

// 需要传参格式化任意数值时用普通方法：每次调用都执行，适合一次性格式化多处
function formatCurrency(value: number): string {
  // Number.isFinite 同时排除 NaN、Infinity、非数字类型，比 typeof number 更严
  if (!Number.isFinite(value)) return '¥0.00'
  return '¥' + value.toFixed(2)
}
</script>

<template>
  <!-- 模板里直接调用方法，不再用管道符 -->
  <p>单价：{{ displayPrice }}</p>
  <p>总价：{{ formatCurrency(totalCost) }}</p>
</template>