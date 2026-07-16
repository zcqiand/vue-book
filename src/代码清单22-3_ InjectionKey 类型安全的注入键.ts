import type { InjectionKey } from 'vue'

// 定义带类型的 key
const themeKey: InjectionKey<Ref<'light' | 'dark'>> = Symbol()

// 提供方
provide(themeKey, theme)

// 注入方：TypeScript 自动推导类型
const theme = inject(themeKey)