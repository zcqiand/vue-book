<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAppStore } from '@/stores/app'
import type { App } from '@/types/app'

// 平台级应用管理列表（ch42）：
// - 列出全部应用
// - 新建 / 编辑 / 删除
// - 每行有"菜单管理"入口（跳到 /platform/apps/:appId/menus）
const app = useAppStore()
const showForm = ref(false)
const editingId = ref<string | null>(null)
const form = ref({
  name: '',
  code: '',
  description: '',
  theme: '#2563eb',
  sort: 100,
  enabled: true,
})

onMounted(async () => {
  await app.fetchApps()
})

function openCreate() {
  editingId.value = null
  form.value = { name: '', code: '', description: '', theme: '#2563eb', sort: 100, enabled: true }
  showForm.value = true
}

function openEdit(row: App) {
  editingId.value = row.id
  form.value = {
    name: row.name,
    code: row.code,
    description: row.description ?? '',
    theme: row.theme,
    sort: row.sort,
    enabled: row.enabled,
  }
  showForm.value = true
}

async function submit() {
  if (editingId.value) {
    await app.updateApp(editingId.value, { ...form.value })
  } else {
    await app.createApp({ ...form.value })
  }
  showForm.value = false
}

async function remove(row: App) {
  if (!confirm(`确定删除应用「${row.name}」？旗下菜单将一并清空`)) return
  await app.removeApp(row.id)
}
</script>