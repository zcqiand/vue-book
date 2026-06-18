import { createApp } from 'vue'

function withSetup<T>(composable: () => T): [T, ReturnType<typeof createApp<T>['mount']>] {
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