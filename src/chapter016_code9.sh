# 在项目根目录运行
npx vue-tsc --noEmit

# 如有类型错误，输出示例：
# src/components/UserBadge.vue:16:31 - error PF0001: Object is possibly 'null'.
#   console.log(user.value.name)
#                             ~~~~
# src/components/UserBadge.vue:20:17 - error PF0009: Property 'namee' does not exist on type '{ id: number; name: string; email: string; }'.
#   { id: '1', namee: 'Bob' }
#             ~~~~~