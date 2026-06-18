<script setup lang="ts">
import { useId } from 'vue'

const id = useId()
const label = '用户名'
const value = defineModel<string>()
</script>

<template>
  <div class="form-field">
    <label :for="id">{{ label }}</label>
    <input
      :id="id"
      v-model="value"
      type="text"
      class="input-field"
      placeholder="请输入用户名"
    />
  </div>
</template>

<style scoped>
.form-field { display: flex; flex-direction: column; gap: 4px; }
.input-field { padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; }
</style>