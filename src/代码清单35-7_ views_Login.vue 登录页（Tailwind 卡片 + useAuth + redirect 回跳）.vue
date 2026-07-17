<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

// 登录页（ch35）：用户名/密码表单 → useAuth().login → 成功跳 redirect 或 /。
// 表单使用 v-model 双向绑定，submit 时做必填校验，登录失败在页内提示。
const router = useRouter()
const route = useRoute()
const { login } = useAuth()

const form = reactive({
  username: '',
  password: '',
})
const error = ref('')
const submitting = ref(false)

async function onSubmit() {
  error.value = ''
  if (!form.username.trim() || !form.password) {
    error.value = '请输入用户名和密码'
    return
  }
  submitting.value = true
  const result = await login(form.username.trim(), form.password)
  submitting.value = false
  if (!result.ok) {
    error.value = result.message ?? '登录失败'
    return
  }
  const redirect = (route.query.redirect as string) || '/'
  await router.push(redirect)
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 px-4">
    <div class="w-full max-w-sm bg-white rounded-lg shadow-md p-8">
      <h1 class="text-2xl font-bold text-center text-gray-800 mb-1">建筑工程实验室管理系统</h1>
      <p class="text-center text-sm text-gray-500 mb-6">请登录以继续</p>
      <form class="space-y-4" @submit.prevent="onSubmit">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 mb-1">用户名</label>
          <input
            id="username"
            v-model.trim="form.username"
            type="text"
            autocomplete="username"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="labadmin / technician"
            data-testid="login-username"
          />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">密码</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            autocomplete="current-password"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="lab123 / tech123"
            data-testid="login-password"
          />
        </div>
        <p v-if="error" class="text-sm text-red-600" data-testid="login-error">{{ error }}</p>
        <button
          type="submit"
          data-fn="M01.F05.I01"
          class="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="submitting"
          data-testid="login-submit"
        >
          {{ submitting ? '登录中…' : '登录' }}
        </button>
      </form>
      <p class="text-xs text-gray-400 mt-4 text-center">
        测试账号：labadmin / lab123（管理员） · technician / tech123（检测员）
      </p>
    </div>
  </div>
</template>