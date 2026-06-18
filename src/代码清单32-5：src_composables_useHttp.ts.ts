import { http } from '@/utils/http'

// Composable 形式：在 setup 上下文里调用 useHttp() 语义更清晰
// 内部就是返回上述 axios 实例与几个语义化别名，不引入额外状态
export function useHttp() {
  // axios 用 delete 作为方法名（与 JS delete 运算符同名）
  // 作为方法调用完全合法，可直接 http.delete('/users/1')
  // 部分团队为语义清晰、避免阅读时与运算符混淆，习惯改名为 del——这是团队约定，不是语法所迫
  return {
    http,
    get: http.get,
    post: http.post,
    put: http.put,
    del: http.delete
  }
}