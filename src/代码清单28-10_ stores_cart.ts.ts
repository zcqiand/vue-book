import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  const totalCount = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )

  function addItem(product: { id: number; name: string; price: number }) {
    const existing = items.value.find(i => i.id === product.id)
    if (existing) {
      existing.quantity++
    } else {
      items.value.push({ ...product, quantity: 1 })
    }
  }

  function updateQuantity(id: number, quantity: number) {
    const item = items.value.find(i => i.id === id)
    if (item && quantity > 0) item.quantity = quantity
    if (item && quantity <= 0) removeItem(id)
  }

  function removeItem(id: number) {
    const idx = items.value.findIndex(i => i.id === id)
    if (idx >= 0) items.value.splice(idx, 1)
  }

  function clear() {
    items.value = []
  }

  return { items, totalCount, totalPrice, addItem, updateQuantity, removeItem, clear }
})