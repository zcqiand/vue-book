export const useCartSetupStore = defineStore('cart-setup', () => {
  const items = ref<CartItem[]>([])

  // 自己实现重置：setup store 无内置 $reset
  function $reset() {
    items.value = []
  }

  return { items, $reset }
})