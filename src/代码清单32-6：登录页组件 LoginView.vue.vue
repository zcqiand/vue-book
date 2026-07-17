<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useHttp } from '@/composables/useHttp'
import type { LoginPayload } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const { get } = useHttp()

// 表单数据用 reactive 集中管理：登录提交时整体序列化为 JSON
const form = reactive<LoginPayload>({
  username: '',
  password: ''
})

// 错误信息用 ref：失败时才赋值，模板里 v-if 控制显隐
const errorMessage = ref<string>('')
// 提交中状态：禁用按钮、防止重复提交
const submitting = ref<boolean>(false)

async function handleLogin(): Promise<void> {
  errorMessage.value = ''

  if (!form.username || !form.password) {
    errorMessage.value = '请输入用户名和密码'
    return
  }

  submitting.value = true
  try {
    await userStore.login({ ...form })

    // 登录成功后立刻调一次受保护接口，验证拦截器已自动注入 Token
    // 能正常拿到数据说明 token 已写入 store 且被请求拦截器正确读取
    await get('/me')

    // 登录成功跳首页：用 replace 避免登录页留在 history，用户按返回键不应回到登录页
    router.replace('/')
  } catch (error) {
    // 拦截器已统一弹错，这里只把消息展示在表单下方，便于用户看到具体原因
    errorMessage.value = error instanceof Error ? error.message : '登录失败，请重试'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <section class="login-page">
    <h2>登录</h2>

    <form @submit.prevent="handleLogin">
      <div class="field">
        <label for="username">用户名</label>
        <input
          id="username"
          v-model.trim="form.username"
          type="text"
          autocomplete="username"
          placeholder="请输入用户名"
        />
      </div>

      <div class="field">
        <label for="password">密码</label>
        <input
          id="password"
          v-model.trim="form.password"
          type="password"
          autocomplete="current-password"
          placeholder="请输入密码"
        />
      </div>

      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

      <button type="submit" :disabled="submitting">
        {{ submitting ? '登录中...' : '登录' }}
      </button>
    </form>
  </section>
</template>

<style scoped>
.login-page {
  max-width: 360px;
  margin: 80px auto;
  padding: 24px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.field {
  margin-bottom: 16px;
}

.field label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  color: #374151;
}

.field input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
}

.error {
  margin: 12px 0;
  color: #dc2626;
  font-size: 13px;
}

button {
  width: 100%;
  padding: 10px 0;
  background-color: #2563eb;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}
</style>