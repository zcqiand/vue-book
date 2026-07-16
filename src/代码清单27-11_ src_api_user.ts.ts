export interface User {
  id: string
  name: string
  email: string
}

export async function fetchUser(id: string): Promise<User> {
  const res = await fetch(`/api/users/${id}`)
  if (!res.ok) throw new Error('Network error')
  return res.json()
}