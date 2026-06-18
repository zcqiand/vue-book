// 修复前：response.data 是 unknown，访问时类型不安全
const res = await fetch('/api/user')
const data = res.data  // error: unknown

// 修复后：给 API 响应定义具体类型
interface UserResponse {
  id: number
  name: string
  email: string
}
const res = await fetch<UserResponse>('/api/user')
const data = res.data  // data 的类型是 UserResponse