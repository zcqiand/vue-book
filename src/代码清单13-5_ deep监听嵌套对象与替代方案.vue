<script setup lang="ts">
import { reactive, watch } from 'vue'

interface Settings {
  profile: {
    name: string
    theme: 'light' | 'dark'
  }
  notifications: {
    email: boolean
    sms: boolean
  }
}

const settings = reactive<Settings>({
  profile: {
    name: '张三',
    theme: 'light',
  },
  notifications: {
    email: true,
    sms: false,
  },
})

// 方案一：深度侦听整个对象——能监听所有嵌套变化，但成本更高
watch(
  settings,
  (newSettings) => {
    console.log('设置变化：', newSettings)
  },
  { deep: true }
)

// 方案二：只监听真正关心的属性——更明确，也更省成本
watch(
  () => settings.profile.theme,
  (newTheme, oldTheme) => {
    console.log(`主题从 ${oldTheme} 切换为 ${newTheme}`)
  }
)

function toggleTheme(): void {
  settings.profile.theme = settings.profile.theme === 'light' ? 'dark' : 'light'
}

function toggleEmail(): void {
  settings.notifications.email = !settings.notifications.email
}
</script>

<template>
  <div>
    <p>用户名：{{ settings.profile.name }}</p>
    <p>主题：{{ settings.profile.theme }}</p>
    <p>邮件通知：{{ settings.notifications.email ? '开启' : '关闭' }}</p>

    <button @click="toggleTheme">切换主题</button>
    <button @click="toggleEmail">切换邮件通知</button>
  </div>
</template>