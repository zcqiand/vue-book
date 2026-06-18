// 错误写法（注释掉）：把表单输入的临时状态塞进 store
// export const useBadStore = defineStore('bad', () => {
//   const formInput = ref('')  // 只在一个组件里用，不需要全局化
//   const isDialogOpen = ref(false)  // 对话框状态，完全局部
//   const buttonLoading = ref(false)  // 按钮 loading，只在该按钮上下文里有效
//   return { formInput, isDialogOpen, buttonLoading }
// })

// 正确写法：这些状态应该用组件内 ref/reactive
// const formInput = ref('')
// const isDialogOpen = ref(false)
// const buttonLoading = ref(false)