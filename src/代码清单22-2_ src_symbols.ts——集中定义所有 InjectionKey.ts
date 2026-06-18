// src/symbols.ts
import type { InjectionKey, Ref } from 'vue'

// 主题的 InjectionKey：类型为 Ref<'light'|'dark'>
// provide 时传入此 key，inject 时类型自动推导为 Ref<'light'|'dark'>
export const themeKey: InjectionKey<Ref<'light' | 'dark'>> = Symbol('theme')

// 主题切换函数的 InjectionKey
export const switchThemeKey: InjectionKey<() => void> = Symbol('switchTheme')

//  locale 字符串的 InjectionKey（演示字符串类型）
export const localeKey: InjectionKey<string> = Symbol('locale')