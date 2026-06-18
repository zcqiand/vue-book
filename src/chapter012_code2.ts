import { ref, computed } from 'vue'

const items = ref([
  { id: 1, name: '苹果', price: 5, qty: 3 },
  { id: 2, name: '香蕉', price: 2, qty: 10 },
])

// 计算属性：总价
const total = computed(() =>
  items.value.reduce((s, i) => s + i.price * i.qty, 0)
)

// 折后价
const discount = computed(() => total.value * 0.9)

// 商品总数
const count = computed(() =>
  items.value.reduce((s, i) => s + i.qty, 0)
)