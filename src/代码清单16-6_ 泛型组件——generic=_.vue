<script setup lang="ts" generic="T">
// generic="T" 声明泛型参数 T，Props 类型由使用方决定

interface Props {
  items: T[]
  renderItem: (item: T, index: number) => string
}

const props = defineProps<Props>()

function getItemText(item: T, index: number): string {
  return props.renderItem(item, index)
}
</script>

<template>
  <ul>
    <li v-for="(item, index) in props.items" :key="index">
      {{ getItemText(item, index) }}
    </li>
  </ul>
</template>