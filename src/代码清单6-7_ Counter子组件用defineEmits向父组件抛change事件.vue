<script setup lang="ts">
// defineEmits 是编译器宏，无需 import
// 推荐用「具名元组」签名：事件名 change，载荷是单个 number
const emit = defineEmits<{
  change: [value: number]
}>()

const props = defineProps<{
  count: number // 当前计数值，由父组件传入，子组件不自管
}>()

function increment() {
  // 子组件不直接改 props.count，而是把新值抛给父组件，由父组件决定是否更新
  emit('change', props.count + 1)
}
</script>

<template>
  <div>
    <span>当前计数：{{ count }}</span>
    <button type="button" @click="increment">+1</button>
  </div>
</template>