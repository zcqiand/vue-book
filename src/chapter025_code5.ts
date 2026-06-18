// 旧写法（Vue 3.4 及之前）
const props = withDefaults(defineProps<{
  title?: string
  count?: number
}>(), {
  title: '默认标题',
  count: 0,
})

// Vue 3.5 新写法：直接在解构时赋默认值
const { title = '默认标题', count = 0 } = defineProps<{
  title?: string
  count?: number
}>()