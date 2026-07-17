<script setup lang="ts">
import { reactive } from 'vue'

interface Config {
  theme: 'light' | 'dark'
  language: string
  notifications: boolean
}

const config = reactive<Config>({
  theme: 'light',
  language: 'zh-CN',
  notifications: true,
})

// 失误：直接整体重新赋值 —— config 变量指向新对象，
// 但模板里绑定的仍是旧 Proxy，新对象完全独立
function brokenReplace(): void {
  // TypeScript 严格模式直接报错：Cannot assign to 'config' because it is a constant
  // 即使绕过类型检查（用 let 或 as），视图也不会更新
  // config = { theme: 'dark', language: 'en-US', notifications: false }
  void config // 占位，避免 unused 警告
}

// 修复一：Object.assign —— 修改原代理对象的已有属性，整体替换仍是同一 Proxy
function patchReplace(): void {
  // Object.assign 会把新属性值写入原 config 代理对象，不会断开响应式连接
  Object.assign(config, { theme: 'dark', language: 'en-US', notifications: false })
}

// 修复二：逐属性修改（当只需要改部分属性时）
function patchTheme(): void {
  config.theme = config.theme === 'light' ? 'dark' : 'light'
}
</script>

<template>
  <div>
    <p>主题：{{ config.theme }}</p>
    <p>语言：{{ config.language }}</p>
    <p>通知：{{ config.notifications ? '开启' : '关闭' }}</p>

    <button @click="patchReplace">整体换配置（Object.assign）</button>
    <button @click="patchTheme">切换主题</button>
  </div>
</template>