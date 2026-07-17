<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { usePermission } from '@/composables/usePermission'

const authStore = useAuthStore()
const { hasPermission, hasRole } = usePermission()

const canCreateUser = computed(() => hasPermission('user:create'))
const canManageOrg = computed(() => hasPermission('org:write'))
const isAdmin = computed(() => hasRole('admin'))

async function handleOrgChange(event: Event): Promise<void> {
  const target = event.target as HTMLSelectElement
  await authStore.switchOrg(target.value)
}
</script>

<template>
  <section class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 class="text-lg font-semibold">组织控制台</h2>
        <p class="mt-2 text-sm text-slate-600">
          当前用户：{{ authStore.user?.displayName }}；当前组织：{{ authStore.currentOrgId ?? '未选择' }}。
        </p>
      </div>
      <label class="text-sm">
        <span class="mr-2 text-slate-500">切换组织</span>
        <select
          class="rounded-lg border border-slate-300 px-3 py-2"
          :value="authStore.currentOrgId ?? ''"
          @change="handleOrgChange"
        >
          <option value="org-acme">Acme</option>
          <option value="org-beta">Beta</option>
        </select>
      </label>
    </div>

    <div class="mt-6 grid gap-4 md:grid-cols-3">
      <article class="rounded-lg border border-slate-200 p-4">
        <p class="text-sm text-slate-500">函数级判断</p>
        <p class="mt-2 font-medium">能否创建用户：{{ canCreateUser ? '可以' : '不可以' }}</p>
        <p class="mt-1 font-medium">能否管理组织：{{ canManageOrg ? '可以' : '不可以' }}</p>
        <p class="mt-1 font-medium">是否管理员：{{ isAdmin ? '是' : '否' }}</p>
      </article>

      <article class="rounded-lg border border-slate-200 p-4">
        <p class="text-sm text-slate-500">指令级判断</p>
        <button
          v-permission="'user:create'"
          class="mt-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white"
          type="button"
        >
          新建用户
        </button>
      </article>

      <article class="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <p class="font-medium">边界说明</p>
        <p class="mt-2 leading-6">
          前端 RBAC 只控制页面显示与交互，后端接口仍必须校验 token、组织 ID 和权限。
        </p>
      </article>
    </div>
  </section>
</template>