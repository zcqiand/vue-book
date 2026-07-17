<script setup lang="ts">
import { ref, computed } from 'vue'

interface Product {
  id: number
  name: string
  inStock: boolean
}

const products = ref<Product[]>([
  { id: 1, name: 'Vue 指南', inStock: true },
  { id: 2, name: 'TS 手册', inStock: false },
  { id: 3, name: 'Vite 教程', inStock: true },
])

// ❶ 用 computed 派生"在售商品"列表，过滤逻辑集中、可缓存
const inStockProducts = computed<Product[]>(() =>
  products.value.filter(product => product.inStock),
)
</script>

<template>
  <div class="products">
    <!--
      反例（不要这样写，这里仅作展示，已注释）：
      <li v-for="product in products" v-if="product.inStock" :key="product.id">
        Vue 3 中 v-if 优先级高于 v-for，这里访问不到 product，会报错
      </li>
    -->

    <h2>在售商品</h2>
    <ul>
      <!-- ❷ 正例：v-for 遍历已过滤的 computed 结果，不再需要 v-if -->
      <li v-for="product in inStockProducts" :key="product.id">
        {{ product.name }}
      </li>
    </ul>
  </div>
</template>