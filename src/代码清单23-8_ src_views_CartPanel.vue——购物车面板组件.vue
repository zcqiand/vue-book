<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCartStore } from '../stores/cart'

const cartStore = useCartStore()

// state 与 getters：必须走 storeToRefs 才能保持响应式
const { items, totalQuantity, totalPrice } = storeToRefs(cartStore)

// actions：直接从实例解构，不需要 storeToRefs
const { addItem, removeItem, updateQuantity, clear } = cartStore

function onAdd() {
  addItem({ id: 1, name: 'Vue 从入门到项目实践', price: 99 })
}
</script>

<template>
  <div class="cart-panel">
    <button @click="onAdd">加入《Vue 从入门到项目实践》</button>

    <ul>
      <li v-for="item in items" :key="item.id">
        {{ item.name }} × {{ item.quantity }}
        （小计 ¥{{ item.price * item.quantity }}）
        <button @click="updateQuantity(item.id, item.quantity + 1)">+</button>
        <button @click="updateQuantity(item.id, item.quantity - 1)">-</button>
        <button @click="removeItem(item.id)">删除</button>
      </li>
    </ul>

    <p>共 {{ totalQuantity }} 件，总价 ¥{{ totalPrice }}</p>
    <button v-if="items.length" @click="clear">清空购物车</button>
  </div>
</template>