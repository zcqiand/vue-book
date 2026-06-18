const inputEl = ref<HTMLInputElement | null>(null)
// 模板：<input ref="inputEl">
// 问题：字符串 ref 名是隐式的，TypeScript 无法在编译期验证 ref 名称是否正确