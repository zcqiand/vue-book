const doubled = computed(() => count.value * 2)
// 自动推断为 ComputedRef<number>