import { defineStore } from 'pinia'

// 购物车条目类型
export interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
  }),

  getters: {
    // 购物车内商品种类数
    itemCount: (state) => state.items.length,
    // 购物车内商品总件数（累加所有 quantity）
    totalQuantity: (state) =>
      state.items.reduce((sum, item) => sum + item.quantity, 0),
    // 总价 getter：单价 × 数量后累加
    totalPrice: (state) =>
      state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  },

  actions: {
    // 增：已存在则数量 +1，否则新增一条
    addItem(product: Omit<CartItem, 'quantity'>) {
      const existing = this.items.find((item) => item.id === product.id)
      if (existing) {
        existing.quantity += 1
      } else {
        this.items.push({ ...product, quantity: 1 })
      }
    },
    // 删：按 id 移除整条
    removeItem(id: number) {
      this.items = this.items.filter((item) => item.id !== id)
    },
    // 改：设置某条的数量，数量为 0 时自动移除
    updateQuantity(id: number, quantity: number) {
      const target = this.items.find((item) => item.id === id)
      if (!target) return
      if (quantity <= 0) {
        this.removeItem(id)
      } else {
        target.quantity = quantity
      }
    },
    // 查：清空整个购物车
    clear() {
      this.items = []
    },
  },
})