const { token, isLoggedIn } = useUserStore()
// token 只是一个字符串快照，不再是响应式的
// 组件不会自动更新！