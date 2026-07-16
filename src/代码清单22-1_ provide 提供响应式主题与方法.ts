import { ref } from 'vue'

const theme = ref<'light' | 'dark'>('light')

provide('theme', theme)
provide('switchTheme', (newTheme: 'light' | 'dark') => {
  theme.value = newTheme
})