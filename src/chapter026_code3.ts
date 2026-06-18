import { markRaw } from 'vue'

// 标记后，chart 永远不会被 Vue 代理
const chart = markRaw(new ECharts(domElement))

// 如果没有 markRaw，每次 ECharts 内部状态更新
// Vue 都会尝试追踪其内部属性的变化