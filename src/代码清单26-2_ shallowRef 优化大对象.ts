// 错误写法（注释掉）：ref 深层代理万行表格数据，初始化和更新都慢
// const tableData = ref<Row[]>([])
// tableData.value = await fetchTableData() // 每行都建立代理，开销数百毫秒

// 正确写法：shallowRef 只追踪 .value 整体替换
const tableData = shallowRef<Row[]>([])

// 加载数据：整体替换只触发一次渲染通知，而非每行都触发
async function loadData(): Promise<void> {
  const res = await fetch('/api/rows')
  tableData.value = res.rows // 整体替换，O(1) 追踪开销
}

// 分页切换：整体替换，触发一次更新
function switchPage(page: number): void {
  tableData.value = allData.slice((page - 1) * 50, page * 50)
}