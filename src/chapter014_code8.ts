import { nextTick } from 'vue'

async function addItem(item: string) {
  list.value.push(item)
  // 等待 Vue 完成 DOM 更新
  await nextTick()
  // 现在 scrollHeight 是最新值
  listEl.value!.scrollTop = listEl.value!.scrollHeight
}