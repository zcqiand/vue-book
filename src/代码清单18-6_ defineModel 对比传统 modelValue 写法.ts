// 传统写法（需要两行）
const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

// defineModel 写法（一行搞定）
const modelValue = defineModel<string>()