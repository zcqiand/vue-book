http.post('*/auth/login', async ({ request }) => {
  const body = (await request.json()) as { username: string; password: string }
  const isAdmin = body.username === 'labadmin' || body.username === 'admin'
  const isTech = body.username === 'technician'
  const isValidPassword =
    (isAdmin && body.password === 'lab123') ||
    (isTech && body.password === 'tech123') ||
    (!isAdmin && !isTech && body.password === 'lab123')
  if (!isValidPassword) {
    return HttpResponse.json({ message: '用户名或密码错误' }, { status: 401 })
  }
  const role = isAdmin ? 'admin' : isTech ? 'technician' : 'admin'
  const roleId = isAdmin ? 'role-admin' : isTech ? 'role-tech' : 'role-admin'
  const permissions = isAdmin
    ? ['project:read', 'project:write', 'sample:read', 'sample:write', 'report:read', 'report:write', 'report:issue', 'user:read', 'user:delete', 'role:read', 'role:write']
    : isTech
      ? ['project:read', 'sample:read', 'sample:write', 'report:read', 'report:write']
      : ['project:read']
  const token = signJwt({
    sub: 'u-001',
    username: body.username,
    role,
    permissions,
  })
  return HttpResponse.json({
    token,
    user: {
      id: 'u-001',
      username: body.username,
      displayName: body.username,
      role: { id: roleId, name: role, permissions },
      permissions,
    },
  })
}),

http.get('*/auth/me', ({ request }) => {
  const auth = request.headers.get('Authorization')
  if (!auth?.startsWith('Bearer ')) {
    return HttpResponse.json({ message: '未授权' }, { status: 401 })
  }
  const payload = verifyJwt(auth.slice(7))
  if (!payload) {
    return HttpResponse.json({ message: 'token 无效或已过期' }, { status: 401 })
  }
  return HttpResponse.json({
    user: {
      id: payload.sub,
      username: payload.username,
      displayName: '管理员',
      role: { id: 'role-admin', name: payload.role, permissions: payload.permissions },
      permissions: payload.permissions,
    },
  })
}),