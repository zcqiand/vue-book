<script setup lang="ts">
const props = defineProps<{
  modelValue: string // 约定的 prop 名必须是 modelValue
}>()

// 约定的事件名必须是 update:modelValue，载荷是新值
const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function onInput(event: Event) {
  // 手动从原生事件里取值，再抛事件给父组件
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <input
    type="text"
    :value="props.modelValue"
    @input="onInput"
  />
</template>