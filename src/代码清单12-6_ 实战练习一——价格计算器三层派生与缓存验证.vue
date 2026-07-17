<script setup lang="ts">
import { reactive, computed } from 'vue'

interface Product {
  originalPrice: number
  discountRate: number
  taxRate: number
  quantity: number
}

const product = reactive<Product>({
  originalPrice: 100,
  discountRate: 0.2, // 八折
  taxRate: 0.13, // 13% 增值税
  quantity: 5,
})

// 第一层：折后单价
const discountedPrice = computed<number>(() => {
  console.count('discountedPrice')
  return product.originalPrice * (1 - product.discountRate)
})

// 第二层：含税总价（依赖第一层 computed，自动建立依赖链）
const taxedTotal = computed<number>(() => {
  console.count('taxedTotal')
  return discountedPrice.value * product.quantity * (1 + product.taxRate)
})

// 第三层：是否满减（只看 quantity，跟价格无关）
const isBulkDiscount = computed<boolean>(() => {
  console.count('isBulkDiscount')
  return product.quantity >= 10
})

function bumpPrice(): void {
  product.originalPrice += 10
  // 只应触发 discountedPrice 和 taxedTotal 重算，isBulkDiscount 不动
}

function bumpQuantity(): void {
  product.quantity += 1
  // 只应触发 taxedTotal 和 isBulkDiscount 重算，discountedPrice 不动
}
</script>

<template>
  <div>
    <p>原价：{{ product.originalPrice }}</p>
    <p>折扣率：{{ (product.discountRate * 100).toFixed(0) }}%</p>
    <p>数量：{{ product.quantity }}</p>
    <hr />
    <p>折后单价：{{ discountedPrice.toFixed(2) }} 元</p>
    <p>含税总价：{{ taxedTotal.toFixed(2) }} 元</p>
    <p>是否满减：{{ isBulkDiscount ? '是' : '否' }}</p>

    <button @click="bumpPrice">原价 +10</button>
    <button @click="bumpQuantity">数量 +1</button>
  </div>
</template>