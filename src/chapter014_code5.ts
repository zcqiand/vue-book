// 子组件 ChildCard.vue
import { defineExpose } from 'vue'

function reset() {
  count.value = 0
}

function refresh() {
  fetchData()
}

defineExpose({ reset, refresh })  // 显式暴露这两个方法