import { computed } from 'vue'
import { scorePassword } from '@/utils/password-strength'

const password = defineModel<string>({ default: '' })
const strength = computed(() => scorePassword(password.value))
const strengthLabel = computed(() =>
  ['极弱', '较弱', '一般', '良好', '强'][strength.value.score])