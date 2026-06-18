import { onMounted, onUnmounted, ref } from 'vue'
import * as echarts from 'echarts'

const chartEl = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null

onMounted(() => {
  // DOM 已挂载，现在可以安全初始化
  if (chartEl.value) {
    chartInstance = echarts.init(chartEl.value)
    chartInstance.setOption({ /* ... */ })
  }
})