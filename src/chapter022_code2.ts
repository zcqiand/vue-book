import { inject } from 'vue'

const theme = inject<Ref<'light' | 'dark'>>('theme')
const switchTheme = inject<(newTheme: 'light' | 'dark') => void>('switchTheme')