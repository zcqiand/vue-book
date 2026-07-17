<script setup lang="ts">
// 组织节点表单弹窗（对齐 React OrgNodeFormModal.tsx）：
// - mode='create'：新增节点（nodeId 为父节点 id）
// - mode='edit'：编辑节点（nodeId 为当前节点 id）
// - 校验非空名称后 emit submit(name, nodeId)
import { ref, watch } from 'vue'

interface OrgNodeFormModalProps {
  visible: boolean
  mode: 'create' | 'edit'
  /** mode=create 时为父节点 id；mode=edit 时为当前节点 id */
  nodeId?: string
  initialName?: string
  loading?: boolean
}

const props = withDefaults(defineProps<OrgNodeFormModalProps>(), {
  nodeId: undefined,
  initialName: '',
  loading: false,
})

const emit = defineEmits<{
  submit: [name: string, nodeId?: string]
  cancel: []
}>()

const name = ref('')
const error = ref('')

// 弹窗打开时同步初始值（与 React useEffect([open, initialName]) 对齐）
watch(
  () => [props.visible, props.initialName],
  () => {
    if (props.visible) {
      name.value = props.initialName
      error.value = ''
    }
  },
  { immediate: true },
)

function handleSubmit(): void {
  const trimmed = name.value.trim()
  if (!trimmed) {
    error.value = '请输入节点名称'
    return
  }
  emit('submit', trimmed, props.nodeId)
}
</script>