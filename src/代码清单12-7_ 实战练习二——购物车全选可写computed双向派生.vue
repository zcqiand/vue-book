<script setup lang="ts">
import { ref, computed } from 'vue'

interface CartItem {
  id: number
  name: string
  selected: boolean
}

const items = ref<CartItem[]>([
  { id: 1, name: 'Vue 3 实战', selected: true },
  { id: 2, name: 'TypeScript 入门', selected: true },
  { id: 3, name: 'Vite 快速入门', selected: false },
])

// 只读派生：已选中数量
const selectedCount = computed<number>(() =>
  items.value.filter((item) => item.selected).length
)

// 可写派生：全选状态
// 读取时遍历 items 判断是否全部 selected
// 写入时遍历 items 把每件商品的 selected 设为新值
const allSelected = computed<boolean>({
  get(): boolean {
    return items.value.length > 0 && items.value.every((item) => item.selected)
  },
  set(newValue: boolean): void {
    items.value.forEach((item) => {
      item.selected = newValue
    })
  },
})

function toggleItem(id: number): void {
  const item = items.value.find((i) => i.id === id)
  if (item) {
    item.selected = !item.selected
  }
}
</script>

<template>
  <div>
    <label>
      <input v-model="allSelected" type="checkbox" />
      全选（已选 {{ selectedCount }} / {{ items.length }}）
    </label>

    <ul>
      <li v-for="item in items" :key="item.id">
        <label>
          <input v-model="item.selected" type="checkbox" />
          {{ item.name }}
        </label>
      </li>
    </ul>

    <button @click="toggleItem(3)">切换第三项选中状态</button>
  </div>
</template>