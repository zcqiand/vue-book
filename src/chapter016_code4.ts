// Vue 3.5+：解构时直接给默认值，等价于旧版 withDefaults
const { title, count = 0, list = [] } = defineProps<{
  title: string
  count?: number
  list: User[]
}>()