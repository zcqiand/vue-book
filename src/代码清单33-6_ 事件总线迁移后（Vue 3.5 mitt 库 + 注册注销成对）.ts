// src/utils/emitter.ts
import mitt, { type Emitter } from 'mitt'

// 用具体的事件类型替代默认的 Record<string, unknown>：调用方拼错事件名会被 TS 拦截
// 这是相比 Vue 2 事件总线的重要升级——后者完全没有类型保护
export type AppEvents = {
  login: { userId: number; username: string }
  logout: undefined
  notification: { message: string; type: 'info' | 'warn' | 'error' }
}

// 全局唯一的 emitter 单例：所有组件共享同一实例，事件才能互通
export const emitter: Emitter<AppEvents> = mitt<AppEvents>()