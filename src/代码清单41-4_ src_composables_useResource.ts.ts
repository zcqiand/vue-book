import { reactive, ref } from 'vue'

export function useResource<T extends Record<string, unknown>, I extends string>(options: {
  createEmpty: () => T
  create: (payload: T) => Promise<unknown>
  update: (id: I, payload: T) => Promise<unknown>
  afterSaved: () => Promise<void>
}) {
  const visible = ref(false)
  const editingId = ref<I | null>(null)
  const saving = ref(false)
  const error = ref('')
  const form = reactive<T>(options.createEmpty())

  function resetForm(next: T): void {
    const currentKeys = Object.keys(form) as Array<keyof T>
    for (const key of currentKeys) {
      delete form[key]
    }
    Object.assign(form, next)
  }

  function openCreate(): void {
    editingId.value = null
    error.value = ''
    resetForm(options.createEmpty())
    visible.value = true
  }

  function openEdit(id: I, current: T): void {
    editingId.value = id
    error.value = ''
    resetForm(JSON.parse(JSON.stringify(current)) as T)
    visible.value = true
  }

  function close(): void {
    visible.value = false
  }

  async function save(): Promise<void> {
    saving.value = true
    error.value = ''
    try {
      const payload = JSON.parse(JSON.stringify(form)) as T
      if (editingId.value) {
        await options.update(editingId.value, payload)
      } else {
        await options.create(payload)
      }
      await options.afterSaved()
      visible.value = false
    } catch (caught) {
      error.value = caught instanceof Error ? caught.message : '保存失败'
    } finally {
      saving.value = false
    }
  }

  return {
    visible,
    editingId,
    saving,
    error,
    form,
    openCreate,
    openEdit,
    close,
    save
  }
}