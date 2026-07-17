<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useSecurityStore } from '@/stores/security'

const sec = useSecurityStore()
const showForm = ref(false)
const form = ref({ name: '', scopesText: '', expiresAt: '' })

onMounted(async () => { await sec.fetchApiKeys() })

async function submit() {
  const scopes = form.value.scopesText.split(',').map((s) => s.trim()).filter(Boolean)
  await sec.createApiKey({
    name: form.value.name,
    scopes,
    expiresAt: form.value.expiresAt || undefined,
  })
  showForm.value = false
  form.value = { name: '', scopesText: '', expiresAt: '' }
}
async function remove(id: string) {
  if (!confirm('确定删除此 API Key？')) return
  await sec.removeApiKey(id)
}
async function toggle(id: string, enabled: boolean) {
  await sec.updateApiKey(id, { enabled })
}
</script>