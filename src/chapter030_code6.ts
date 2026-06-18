// ✅ 正确写法：window 相关逻辑放在 onMounted 内
onMounted(() => {
  const width = window.innerWidth
  if (width < 768) {
    isMobile.value = true
  }
})