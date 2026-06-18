<script setup lang="ts">
import { reactive } from 'vue'

// ❶ 用 reactive 定义表单状态与错误信息，字段一一对应
interface LoginFormState {
  email: string
  password: string
  remember: boolean
}

interface LoginFormErrors {
  email: string
  password: string
}

const form = reactive<LoginFormState>({
  email: '',
  password: '',
  remember: false,
})

const errors = reactive<LoginFormErrors>({
  email: '',
  password: '',
})

// ❷ 验证函数：通过返回空字符串，失败返回错误信息
function validateEmail(value: string): string {
  if (value.length === 0) return '邮箱不能为空'
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(value) ? '' : '请输入有效的邮箱格式'
}

function validatePassword(value: string): string {
  if (value.length === 0) return '密码不能为空'
  return value.length >= 6 ? '' : '密码至少需要6个字符'
}

// ❸ 即时验证：失焦时校验对应字段
function validateField(field: 'email' | 'password'): void {
  if (field === 'email') {
    errors.email = validateEmail(form.email)
  } else {
    errors.password = validatePassword(form.password)
  }
}

// ❹ 提交处理：.prevent 已在模板阻止默认行为，这里只做整体验证
function handleSubmit(): void {
  errors.email = validateEmail(form.email)
  errors.password = validatePassword(form.password)

  if (!errors.email && !errors.password) {
    console.log('提交的登录数据：', {
      email: form.email,
      password: form.password,
      remember: form.remember,
    })
    alert('登录成功！')
  }
}
</script>

<template>
  <!-- ❺ @submit.prevent 阻止表单默认提交导致的页面刷新 -->
  <form @submit.prevent="handleSubmit">
    <div>
      <label>邮箱</label>
      <!-- ❻ v-model.trim 自动去空格，@blur 失焦时即时验证 -->
      <input
        v-model.trim="form.email"
        type="email"
        placeholder="请输入邮箱"
        @blur="validateField('email')"
      />
      <span v-if="errors.email" style="color: red">{{ errors.email }}</span>
    </div>

    <div>
      <label>密码</label>
      <input
        v-model="form.password"
        type="password"
        placeholder="请输入密码"
        @blur="validateField('password')"
      />
      <span v-if="errors.password" style="color: red">{{ errors.password }}</span>
    </div>

    <div>
      <label>
        <input type="checkbox" v-model="form.remember" />
        记住我
      </label>
    </div>

    <button type="submit">登录</button>
  </form>
</template>