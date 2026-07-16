const errors = computed(() => {
  const e: Record<string, string> = {}

  if (!form.username.trim())
    e.username = '用户名不能为空'
  else if (form.username.length < 3)
    e.username = '用户名至少3个字符'

  if (!form.email.match(/^[\w.]+@([\w.]+\.)+\w{2,}$/))
    e.email = '邮箱格式不正确'

  if (form.password.length < 8)
    e.password = '密码至少8个字符'

  if (form.confirmPassword !== form.password)
    e.confirmPassword = '两次输入的密码不一致'

  return e
})