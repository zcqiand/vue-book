<template>
  <button class="themed-btn" @click="handleClick">
    <slot />
  </button>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import type { ComputedRef, Ref } from 'vue'

type ThemeName = 'light' | 'dark'

// inject 返回值可能为 undefined（未提供 provider 时），
// 任何一处都必须在使用前判空；这里把 currentTheme 提到 handleClick 之前
// 声明是为了方便配合 switchTheme 同时校验
const themeConfig = inject<ComputedRef<Record<string, string>>>('themeConfig')
const currentTheme = inject<Ref<ThemeName>>('themeName')
const switchTheme = inject<(name: ThemeName) => void>('switchTheme')

function handleClick(): void {
  if (!switchTheme || !currentTheme) {
    // 未注入 provider：直接 return 或给出可观察的提示
    console.warn('[ThemedButton] 未注入 theme provider，无法切换主题')
    return
  }
  switchTheme(currentTheme.value === 'light' ? 'dark' : 'light')
}
</script>