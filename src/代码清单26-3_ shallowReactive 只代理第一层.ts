import { shallowReactive } from 'vue'

// shallowReactive：只代理对象第一层属性，深层属性不代理
const state = shallowReactive({
  title: '初始标题',        // 改 title.value 会触发响应式
  meta: { count: 0 },      // 改 meta.count 不会触发响应式
  items: []                // 改 items 整体会触发，改 items[0].name 不会
})

state.title = '新标题'       // 触发更新
state.meta.count = 5       // 不触发！meta 本身是响应式但深层不是
state.items = [1, 2, 3]   // 触发更新（整体替换）