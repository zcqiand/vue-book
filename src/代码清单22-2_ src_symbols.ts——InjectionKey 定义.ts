import type { InjectionKey } from 'vue'
import type { Ref } from 'vue'

export const themeKey: InjectionKey<Ref<'light' | 'dark'>> = Symbol()
export const localeKey: InjectionKey<string> = Symbol()