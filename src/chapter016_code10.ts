const items = ref<Item[]>([])  // 显式标注，意图清晰
const rawItems = ref([])       // 省略推断，类型为 Ref<never[]>（初值类型推断为空数组）