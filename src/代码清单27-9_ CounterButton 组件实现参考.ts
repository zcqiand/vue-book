<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  start?: number
  step?: number
  modelValue?: number
}>(), { start: 0, step: 1, modelValue: undefined })

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const display = ref(props.modelValue ?? props.start)

watch(display, (v) => emit('update:modelValue', v))

function increment() { display.value += props.step }
function reset() { display.value = props.start }
</script>

<template>
  <div>
    <span data-test="display">{{ display }}</span>
    <button data-test="inc" @click="increment">增加</button>
    <button data-test="reset" @click="reset">重置</button>
  </div>
</template>