<script setup lang="ts">
import { ref, computed } from 'vue'

interface CartItem {
  id: number
  name: string
  price: number
  qty: number
}

const items = ref<CartItem[]>([
  { id: 1, name: 'Vue 3 实战', price: 89, qty: 2 },
  { id: 2, name: 'TypeScript 入门', price: 59, qty: 1 },
  { id: 3, name: 'Vite 快速入门', price: 39, qty: 3 },
])

// computed 自动追踪 items.value 中所有响应式依赖
// 只有 items 本身或其内部任意属性（price/qty）变化时，才重新执行求值函数
const total = computed<number>(() =>
  items.value.reduce((sum, item) => sum + item.price * item.qty, 0)
)

const totalCount = computed<number>(() =>
  items.value.reduce((sum, item) => sum + item.qty, 0)
)

function increaseQty(id: number): void {
  const item = items.value.find((i) => i.id === id)
  if (item) {
    item.qty++
    // items.value 已变化，total 和 totalCount 自动重算
  }
}

function decreaseQty(id: number): void {
  const item = items.value.find((i) => i.id === id)
  if (item && item.qty > 0) {
    item.qty--
  }
}

function removeItem(id: number): void {
  const idx = items.value.findIndex((i) => i.id === id)
  if (idx !== -1) {
    items.value.splice(idx, 1)
  }
}
</script>

<template>
  <div>
    <h2>购物车</h2>
    <ul>
      <li v-for="item in items" :key="item.id">
        {{ item.name }} —— 单价: {{ item.price }}元 x {{ item.qty }}本 =
        {{ item.price * item.qty }}元
        <button @click="increaseQty(item.id)">+</button>
        <button @click="decreaseQty(item.id)">-</button>
        <button @click="removeItem(item.id)">移除</button>
      </li>
    </ul>
    <p>共 {{ totalCount }} 本书</p>
    <p>总金额：{{ total }} 元</p>
  </div>
</template>