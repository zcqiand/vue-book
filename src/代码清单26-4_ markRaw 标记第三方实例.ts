import { markRaw, ref } from 'vue'

// 第三方图表实例不需要 Vue 追踪其内部状态
const chartInstance = markRaw(new ThirdPartyChart(domElement))

// 如果没有 markRaw，Vue 会尝试追踪 chartInstance 内部状态变化
// chartInstance.updateData(...) 时 Vue 也会收到通知，造成双重的状态管理冲突

// 应用状态
const appState = ref({ selectedChartId: 'chart-1' })

// markRaw 后，chartInstance 完全由第三方管理，Vue 不介入