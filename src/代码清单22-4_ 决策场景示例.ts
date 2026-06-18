// 场景一：主题切换——只在特定布局的组件树下使用
// → provide/inject 适合，因为只在布局的子孙组件间共享
const themeKey: InjectionKey<Ref<'light' | 'dark'>> = Symbol()
provide(themeKey, ref('light'))

// 场景二：用户登录态——应用内任意位置都可能需要
// → Pinia 适合，因为全局跨树共享
import { defineStore } from 'pinia'
export const useUserStore = defineStore('user', () => {
  const token = ref<string | null>(null)
  return { token }
})