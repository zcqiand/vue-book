<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { handleOAuthCallback } from '@/composables/useOAuth'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const errorMessage = ref('')

function readProvider(): 'github' | 'google' {
  const provider = route.params.provider
  if (provider === 'github' || provider === 'google') return provider
  throw new Error('不支持的 OAuth provider')
}

onMounted(async () => {
  try {
    const code = typeof route.query.code === 'string' ? route.query.code : ''
    const provider = readProvider()
    if (code.length === 0) throw new Error('OAuth 回调缺少 code')
    const result = await handleOAuthCallback(code, provider)
    // 由 auth store 接管 token / user / orgId，并触发首次权限拉取
    await authStore.loginWithSso(code, provider)
    await router.replace('/')
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'OAuth 登录失败'
  }
})
</script>

<template>
  <section class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
    <h2 class="text-lg font-semibold">正在处理 OAuth 授权码回调</h2>
    <p v-if="errorMessage.length === 0" class="mt-2 text-sm text-slate-600">
      正在通过后端 exchange 接口换取本系统 token。
    </p>
    <p v-else class="mt-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
      {{ errorMessage }}
    </p>
  </section>
</template>