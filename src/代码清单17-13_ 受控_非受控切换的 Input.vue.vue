<template>
  <input
    class="custom-input"
    :value="current"
    :placeholder="placeholder"
    @input="handleInput"
  />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

interface Props {
  modelValue?: string
  defaultValue?: string
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  defaultValue: '',
  placeholder: '请输入',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const isControlled = computed<boolean>(() => props.modelValue !== undefined)
const local = ref<string>(props.defaultValue ?? '')

watch(
  () => props.defaultValue,
  (v) => { local.value = v ?? '' }
)

const current = computed<string>(() =>
  isControlled.value ? (props.modelValue ?? '') : local.value
)

function handleInput(e: Event): void {
  const value = (e.target as HTMLInputElement).value
  if (!isControlled.value) {
    local.value = value
  }
  emit('update:modelValue', value)
}
</script>