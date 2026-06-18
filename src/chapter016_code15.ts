// 父组件中监听时，payload 的类型已经被推导为 { email: string; password: string }
function handleSubmit(payload: { email: string; password: string }) {
  console.log(payload.email)
}