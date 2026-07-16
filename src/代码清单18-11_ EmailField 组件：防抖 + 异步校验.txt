<script setup lang="ts">
import { ref } from 'vue'
import { useDebounceFn } from '@/composables/useDebounce'
import { mockCheckEmail } from '@/api/mock-users'

const email = defineModel<string>({ default: '' })
const emailError = ref('')
const checking = ref(false)

const validate = useDebounceFn(async (val: string) => {
  if (!val) { emailError.value = ''; return }
  if (!val.match(/^[\w.]+@([\w.]+\.)+\w{2,}$/)) {
    emailError.value = '邮箱格式不正确'
    return
  }
  checking.value = true
  const { taken } = await mockCheckEmail(val)
  checking.value = false
  emailError.value = taken ? '该邮箱已被注册' : ''
}, 500)

function onInput(e: Event) {
  email.value = (e.target as HTMLInputElement).value
  validate(email.value)
}
</script>

<template>
  <div class="field">
    <label>邮箱</label>
    <input :value="email" @input="onInput" />
    <span v-if="checking" class="hint">校验中…</span>
    <span v-else-if="emailError" class="error">{{ emailError }}</span>
  </div>
</template>