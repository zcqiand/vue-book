<script setup lang="ts">
import { useTemplateRef } from 'vue'

// useTemplateRef：编译器验证 ref 名称是否存在于模板
const inputRef = useTemplateRef<HTMLInputElement>('input-el')

function focus(): void {
  inputRef.value?.focus()
}

function blur(): void {
  inputRef.value?.blur()
}
</script>

<template>
  <div class="input-wrapper">
    <input ref="input-el" type="text" placeholder="聚焦此输入框" />
    <div class="btn-group">
      <button type="button" @click="focus">聚焦</button>
      <button type="button" @click="blur">失焦</button>
    </div>
  </div>
</template>