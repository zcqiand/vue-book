// ref：深层代理，每行数据都建立响应式追踪
const tableData = ref<Row[]>([])
// 初始化一万行时，Vue 代理开销可能达数百毫秒

// shallowRef：只追踪 .value 替换，不深层代理
const tableData = shallowRef<Row[]>([])
// 初始化时 Vue 不遍历数组内容，开销极低
// 当你执行 tableData.value = newData 时，Vue 只通知「value 变了」
// 不通知「value 内部某行变了」