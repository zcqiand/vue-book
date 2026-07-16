import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { CartItem } from './cart'

export const useCartSetupStore = defineStore('cart-setup', () => {
  // state → ref
  const items = ref<CartItem[]>([])

  // getters → computed
  const itemCount = computed(() => items.value.length)
  const totalQuantity = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0),
  )
  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0),
  )

  // actions → 普通函数
  function addItem(product: Omit<CartItem, 'quantity'>) {
    const existing = items.value.find((item) => item.id === product.id)
    if (existing) {
      existing.quantity += 1
    } else {
      items.value.push({ ...product, quantity: 1 })
    }
  }
  function removeItem(id: number) {
    items.value = items.value.filter((item) => item.id !== id)
  }
  function clear() {
    items.value = []
  }

  // 只有 return 出去的才对外暴露
  return { items, itemCount, totalQuantity, totalPrice, addItem, removeItem, clear }
})