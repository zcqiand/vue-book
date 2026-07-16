<template>
  <div class="theme-provider" :class="themeClass">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { provide, computed, ref } from 'vue'

type ThemeName = 'light' | 'dark'

const themeConfig: Record<ThemeName, Record<string, string>> = {
  light: { '--bg': '#ffffff', '--text': '#111827' },
  dark: { '--bg': '#1f2937', '--text': '#f9fafb' },
}

const currentTheme = ref<ThemeName>('light')

provide('themeName', currentTheme)
provide('themeConfig', computed(() => themeConfig[currentTheme.value]))

function switchTheme(name: ThemeName): void {
  currentTheme.value = name
}
provide('switchTheme', switchTheme)

const themeClass = computed(() => `theme-${currentTheme.value}`)
</script>