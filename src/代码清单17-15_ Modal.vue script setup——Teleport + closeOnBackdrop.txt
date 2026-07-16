<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  visible: boolean
  title?: string
  closeOnBackdrop?: boolean
  width?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  title: '提示',
  closeOnBackdrop: true,
  width: 520,
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
  close: []
}>()

const panelStyle = computed<Record<string, string>>(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
}))

function close(): void {
  emit('update:visible', false)
  emit('close')
}

function handleBackdrop(): void {
  if (props.closeOnBackdrop) close()
}
</script>