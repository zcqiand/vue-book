<script setup lang="ts">
import { inject } from 'vue'
import type { InjectionKey, Ref } from 'vue'

const themeKey: InjectionKey<Ref<'light' | 'dark'>> = Symbol('theme')
const switchThemeKey: InjectionKey<(next: 'light' | 'dark') => void> = Symbol('switchTheme')

const theme = inject(themeKey)
const switchTheme = inject(switchThemeKey)
</script>

<template>
  <section
    class="content-theme"
    :style="{ background: theme === 'dark' ? '#1f1f1f' : '#ffffff' }"
  >
    <p>当前主题：{{ theme }}</p>
    <button @click="switchTheme?.('light')">切到浅色</button>
    <button @click="switchTheme?.('dark')">切到深色</button>
  </section>
</template>