const props = withDefaults(defineProps<{
  open: boolean; title: string; message: string
  loading?: boolean; confirmText?: string; cancelText?: string
  loadingText?: string; danger?: boolean
}>(), { loading: false, confirmText: '确认', cancelText: '取消', loadingText: '处理中...', danger: true })
const emit = defineEmits<{ (e: 'confirm'): void; (e: 'cancel'): void }>()