onUnmounted(() => {
  // 组件销毁时清理图表实例
  chartInstance?.dispose()
  chartInstance = null
})