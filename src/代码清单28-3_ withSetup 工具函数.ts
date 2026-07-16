import { createApp, type App } from 'vue'

export function withSetup<T>(composable: () => T): [T, App] {
  let result: T
  const app = createApp({
    setup() {
      result = composable()
      return () => {} // 不渲染任何内容
    },
  })
  const root = document.createElement('div')
  app.mount(root)
  return [result!, app]
}