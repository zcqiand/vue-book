<script setup lang="ts">
import { reactive } from 'vue'

interface SignupForm {
  username: string
  email: string
  age: number | ''
}

interface SignupErrors {
  username: string
  email: string
  age: string
}

const form = reactive<SignupForm>({
  username: '',
  email: '',
  age: '',
})

const errors = reactive<SignupErrors>({
  username: '',
  email: '',
  age: '',
})

// ❶ 校验函数返回空串表示通过
function validateUsername(value: string): string {
  if (value.length === 0) return '用户名不能为空'
  return value.length >= 3 ? '' : '用户名至少需要3个字符'
}

function validateEmail(value: string): string {
  if (value.length === 0) return '邮箱不能为空'
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(value) ? '' : '邮箱格式不正确'
}

function validateAge(value: number | ''): string {
  if (value === '') return '' // 可选字段，空值不算错
  return value >= 0 ? '' : '年龄不能为负数'
}

// ❷ 字面量联合类型约束字段名
function validateField(field: keyof SignupForm): void {
  if (field === 'username') {
    errors.username = validateUsername(form.username)
  } else if (field === 'email') {
    errors.email = validateEmail(form.email)
  } else {
    errors.age = validateAge(form.age)
  }
}

function handleSubmit(): void {
  errors.username = validateUsername(form.username)
  errors.email = validateEmail(form.email)
  errors.age = validateAge(form.age)

  const passed =
    !errors.username && !errors.email && !errors.age
  if (passed) {
    console.log('注册信息合法：', { ...form })
    alert('注册成功！')
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" style="display: grid; gap: 12px; max-width: 320px">
    <div>
      <label>用户名</label>
      <input
        v-model.trim="form.username"
        type="text"
        @blur="validateField('username')"
      />
      <p v-if="errors.username" style="color: red; margin: 4px 0">{{ errors.username }}</p>
    </div>

    <div>
      <label>邮箱</label>
      <input
        v-model.trim="form.email"
        type="email"
        @blur="validateField('email')"
      />
      <p v-if="errors.email" style="color: red; margin: 4px 0">{{ errors.email }}</p>
    </div>

    <div>
      <label>年龄（可选）</label>
      <input
        v-model.number="form.age"
        type="number"
        @blur="validateField('age')"
      />
      <p v-if="errors.age" style="color: red; margin: 4px 0">{{ errors.age }}</p>
    </div>

    <button type="submit">注册</button>
  </form>
</template>