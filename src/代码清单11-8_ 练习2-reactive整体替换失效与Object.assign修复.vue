<script setup lang="ts">
import { reactive, ref } from 'vue'

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

// 失败示范：试图整体重新赋值
// 注释解开后会看到 TS 报错或运行时视图无变化
function brokenReplace(): void {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _newConfig: Config = {
    theme: 'dark',
    language: 'en-US',
    notifications: false,
  }
  // 真正的赋值（用 any cast 绕过 TS 检查）
  // (config as any) = _newConfig  // 视图不会更新
  alert('整体重新赋值不会生效——你看到了吗？')
}

// 正确示范：Object.assign 写入原代理
function workingReplace(): void {
  Object.assign(config, {
    theme: 'dark',
    language: 'en-US',
    notifications: false,
  })
}

// 替代方案演示：改用 ref 包对象就能真正整体替换
const configRef = ref<Config>({
  theme: 'light',
  language: 'zh-CN',
  notifications: true,
})

function refReplace(): void {
  configRef.value = {
    theme: 'dark',
    language: 'en-US',
    notifications: false,
  }
}
</script>

<template>
  <section>
    <h3>reactive（无法整体替换）</h3>
    <p>主题：{{ config.theme }} / 语言：{{ config.language }} / 通知：{{ config.notifications }}</p>
    <button @click="brokenReplace">整体替换（失效演示）</button>
    <button @click="workingReplace">Object.assign 修复</button>

    <h3>ref 包装（能整体替换）</h3>
    <p>主题：{{ configRef.theme }} / 语言：{{ configRef.language }} / 通知：{{ configRef.notifications }}</p>
    <button @click="refReplace">ref 整体替换</button>
  </section>
</template>