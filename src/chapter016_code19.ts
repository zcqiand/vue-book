// 修复前：传了字符串 ID
emit('change', userId)  // userId 是 string

// 修复后：确认 defineEmits 里声明的是 string，或者把 ID 统一为 number
emit('change', Number(userId))