import { ref, computed } from 'vue'

const submitting = ref(false)
const submitError = ref('')

const errors = computed(() => {
  const e: Record<string, string> = {}
  if (!form.username.trim()) e.username = '用户名不能为空'
  if (!form.password || scorePassword(form.password).score < 2)
    e.password = '密码强度不足'
  return e
})

async function onSubmit() {
  if (checking.value) {
    submitError.value = '邮箱仍在校验中，请稍候'
    return
  }
  if (Object.keys(errors.value).length > 0 || emailError.value) {
    submitError.value = '请先修正表单中的错误'
    return
  }
  submitting.value = true
  try {
    await new Promise(r => setTimeout(r, 800))  // 模拟提交
    alert('注册成功')
  } catch {
    submitError.value = '提交失败，请稍后重试'
  } finally {
    submitting.value = false
  }
}