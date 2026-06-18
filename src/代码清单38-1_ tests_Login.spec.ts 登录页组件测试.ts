import { mount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { defineStore } from 'pinia'
import { defineComponent, ref } from 'vue'
import {
  createMemoryHistory,
  createRouter,
  useRouter,
  type RouteRecordRaw,
} from 'vue-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const useAuthStore = defineStore('auth', {
  actions: {
    async login(payload: { username: string; password: string }): Promise<void> {
      if (!payload.username || !payload.password) {
        throw new Error('用户名和密码不能为空')
      }
    },
  },
})

const Login = defineComponent({
  name: 'Login',
  setup() {
    const username = ref('')
    const password = ref('')
    const authStore = useAuthStore()
    const router = useRouter()

    async function handleLogin(): Promise<void> {
      await authStore.login({ username: username.value, password: password.value })
      await router.push('/projects')
    }

    return { username, password, handleLogin }
  },
  template: `
    <form aria-label="login form" @submit.prevent="handleLogin">
      <input data-testid="username" v-model="username" autocomplete="username" />
      <input data-testid="password" v-model="password" type="password" autocomplete="current-password" />
      <button data-testid="login-button" type="button" @click="handleLogin">登录</button>
    </form>
  `,
})

function createTestRouter() {
  const routes: RouteRecordRaw[] = [
    { path: '/', component: { template: '<main>首页</main>' } },
    { path: '/projects', component: { template: '<main>检测项目列表</main>' } },
  ]

  return createRouter({
    history: createMemoryHistory(),
    routes,
  })
}

describe('Login.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('输入用户名和密码后点击登录，会调用 auth store.login 并跳转到检测项目列表', async () => {
    const router = createTestRouter()
    const routerPushSpy = vi.spyOn(router, 'push')
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      stubActions: true,
    })

    await router.push('/')
    await router.isReady()

    const wrapper = mount(Login, {
      global: {
        plugins: [pinia, router],
      },
    })
    const authStore = useAuthStore()

    await wrapper.get('[data-testid="username"]').setValue('inspector')
    await wrapper.get('[data-testid="password"]').setValue('safe-password-123')
    await wrapper.get('[data-testid="login-button"]').trigger('click')
    await flushPromises()

    expect(authStore.login).toHaveBeenCalledTimes(1)
    expect(authStore.login).toHaveBeenCalledWith({
      username: 'inspector',
      password: 'safe-password-123',
    })
    expect(routerPushSpy).toHaveBeenCalledWith('/projects')
  })
})