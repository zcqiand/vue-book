// 响应式注入：provide 一个 ref
const theme = ref<'light' | 'dark'>('light')
provide('theme', theme)
// 注入方获取后响应式，修改 theme.value 后所有注入方同步更新

// 静态注入：provide 一个普通字符串
provide('appName', '我的应用')
// 注入方获取的是一个常量快照，后续修改对注入方不可见