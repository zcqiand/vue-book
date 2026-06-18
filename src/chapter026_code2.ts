// shallowRef 下手动触发更新的方式：整体替换
tableData.value = [...tableData.value] // 创建新数组，触发追踪
// 或者
tableData.value.splice(rowIndex, 1, newRow) // 替换某一行后整体替换