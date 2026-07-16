<script setup lang="ts">
// 角色管理列表（对齐 React rbac/RoleList.tsx）。
// onMounted 拉列表；新建/编辑走 RoleFormModal；删除走 ConfirmModal 二次确认。
import { ref, onMounted } from 'vue'
import { useRoleStore } from '@/stores/rbac'
import type { Role, RoleCreateInput, MenuPermission } from '@/types/rbac'
import RoleFormModal, { type RoleFormValues } from '@/components/RoleFormModal.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'

const store = useRoleStore()

const formVisible = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const editing = ref<Role | null>(null)
const submitting = ref(false)
const deleteTarget = ref<Role | null>(null)
const deleting = ref(false)

onMounted(() => {
  store.fetchRoles()
})

function openCreate() {
  formMode.value = 'create'
  editing.value = null
  formVisible.value = true
}

function openEdit(role: Role) {
  formMode.value = 'edit'
  editing.value = role
  formVisible.value = true
}

async function handleSubmit(values: RoleFormValues) {
  submitting.value = true
  try {
    const input: RoleCreateInput = {
      name: values.name,
      permissions: values.permissions,
      menuPermissions: values.menuPermissions as MenuPermission[],
    }
    if (formMode.value === 'create') {
      await store.createRole(input)
    } else if (editing.value) {
      await store.updateRole(editing.value.id, input)
    }
    formVisible.value = false
    await store.fetchRoles()
  } finally {
    submitting.value = false
  }
}

async function handleDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await store.deleteRole(deleteTarget.value.id)
    deleteTarget.value = null
    await store.fetchRoles()
  } finally {
    deleting.value = false
  }
}
</script>