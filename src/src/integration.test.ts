// 代码清单28-4: 集成测试 — 父子组件 + Pinia 协作
// src/integration.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from './stores/user'
import UserBadge from './components/UserBadge.vue'
import App from './App.vue

describe('父子组件 + Pinia 集成测试', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('UserBadge 渲染未登录状态', () => {
    const wrapper = mount(UserBadge)
    expect(wrapper.find('.guest').exists()).toBe(true)
    expect(wrapper.find('.username').exists()).toBe(false)
  })

  it('登录后 UserBadge 渲染用户信息', async () => {
    const store = useUserStore()

    // Mock 登录接口
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          token: 'mock-token-001',
          userInfo: { id: 1, name: 'Alice', avatar: 'https://example.com/alice.png' },
        }),
    })

    // 执行登录
    await store.login('alice', 'password')

    // 挂载 UserBadge，验证渲染内容与 store 状态同步
    const wrapper = mount(UserBadge)
    expect(wrapper.find('.username').text()).toBe('Alice')
    expect(wrapper.find('.avatar').exists()).toBe(true)
    expect(wrapper.find('.guest').exists()).toBe(false)
  })

  it('App 集成测试：登录后子组件渲染正确', async () => {
    const wrapper = mount(App, { attachTo: document.body })

    // 初始状态：未登录
    expect(wrapper.find('.guest').exists()).toBe(true)

    // Mock 登录接口
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          token: 'app-token-001',
          userInfo: { id: 2, name: 'Bob' },
        }),
    })

    // 点击登录按钮
    await wrapper.find('button[type="submit"]').trigger('click')

    // 等待异步登录完成
    await wrapper.vm.$nextTick()

    // 验证子组件 UserBadge 响应 store 变化
    expect(wrapper.find('.username').text()).toBe('Bob')
    expect(wrapper.find('.guest').exists()).toBe(false)

    wrapper.unmount()
  })
})