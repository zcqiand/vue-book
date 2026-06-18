import { watch, onWatcherCleanup } from 'vue'

watch(id, (newId) => {
  const controller = new AbortController()

  fetch(`/api/${newId}`, { signal: controller.signal })

  onWatcherCleanup(() => {
    controller.abort()
  })
})