<script setup lang="ts">
// App.vue —— 三类状态的提供方
import { ref, provide } from 'vue'
import type { InjectionKey, Ref } from 'vue'
import Layout from './Layout.vue'

interface User {
  id: number
  name: string
  initial: string
}

interface AppConfig {
  appName: string
  year: number
}

// 集中定义 InjectionKey（也可拆到 src/types/injection-keys.ts）
const themeKey: InjectionKey<Ref<'light' | 'dark'>> = Symbol('theme')
const switchThemeKey: InjectionKey<(next: 'light' | 'dark') => void> = Symbol('switchTheme')
const userKey: InjectionKey<Ref<User | null>> = Symbol('user')
const configKey: InjectionKey<AppConfig> = Symbol('config')

// 响应式状态：主题与用户身份需要在跨层链路里实时同步
const theme = ref<'light' | 'dark'>('light')
const currentUser = ref<User | null>({ id: 1, name: '管理员', initial: '管' })

function switchTheme(next: 'light' | 'dark'): void {
  theme.value = next
}

// 静态配置：应用启动后不会变的元数据走快照更合适
const config: AppConfig = { appName: 'XR 知识套件', year: 2026 }

// 三组 provide：分别对应 ref、回调函数、普通对象三种形态
provide(themeKey, theme)
provide(switchThemeKey, switchTheme)
provide(userKey, currentUser)
provide(configKey, config)
</script>

<template>
  <div>
    <button @click="switchTheme('light')">浅色</button>
    <button @click="switchTheme('dark')">深色</button>
    <button
      @click="currentUser = { id: 2, name: '普通成员', initial: '成' }"
    >
      切换为普通成员
    </button>
    <Layout />
  </div>
</template>