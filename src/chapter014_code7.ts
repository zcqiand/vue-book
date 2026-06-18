const list = ref<string[]>([])
const listEl = useTemplateRef<HTMLUListElement>('listEl')

async function addItem(item: string) {
  list.value.push(item)
  // 立即读取 scrollHeight——此时 DOM 还没更新！
  listEl.value!.scrollTop = listEl.value!.scrollHeight
}