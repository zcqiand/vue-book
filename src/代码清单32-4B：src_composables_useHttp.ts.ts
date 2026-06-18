import { http } from '@/utils/http'

// Composable 形式：在 setup 上下文里调用 useHttp() 语义更清晰
// 内部就是返回上述 axios 实例与几个语义化别名，不引入额外状态
export function useHttp() {
  // delete 是 JS 保留字，作为对象方法名虽合法但调用要写 http['delete']
  // 改名为 del 后，组件里可直接写 http.del('/users/1')
  return {
    http,
    get: http.get,
    post: http.post,
    put: http.put,
    del: http.delete
  }
}