import { http, HttpResponse } from 'msw'
import {
  findTenant,
  type MockTenant,
  insertTenant,
  updateTenantRecord,
  deleteTenantRecord,
  queryTenants,
  // ……（其余 listRoles / queryUsers / getOrgTree / queryAuditLogs 等导入省略，
  //      完整 import 见真实文件第 2-71 行）……
} from './db'

// MSW handler 注册表（ch39-42 focus）。
// ch39：/tenants GET 列表 + /tenants/:id GET 单个 + 平台 CRUD。
// ch40：追加 SSO/OAuth 授权服务器 + auth/permissions + auth/me（只增不改）。
// ch41：追加 users/orgs/audit-logs。
// 路由与响应 shape 与 React 双栈仓完全一致。
export const handlers = [
  // —— ch39：租户 ——
  http.get('*/tenants/:id', ({ params }) => {
    const tenant = findTenant(String(params.id))
    if (!tenant) {
      return HttpResponse.json({ message: '租户不存在' }, { status: 404 })
    }
    return HttpResponse.json(tenant as MockTenant)
  }),

  // ……（ch40 SSO/OAuth、ch41 users/orgs/audit-logs、ch42 vitals 见对应章节）……

  // —— 平台租户管理 CRUD（ch39 列表/详情已含；此处补增改删）——
  http.get('*/tenants', ({ request }) => {
    const url = new URL(request.url)
    const keyword = url.searchParams.get('keyword') ?? undefined
    return HttpResponse.json(queryTenants({ keyword }))
  }),

  http.post('*/tenants', async ({ request }) => {
    const body = (await request.json()) as {
      name: string
      theme: { primary: string; sidebar: string; logoText: string }
      features?: string[]
      config?: { maxUsers?: number }
    }
    if (!body.name || !body.theme) {
      return HttpResponse.json({ message: 'name 和 theme 必填' }, { status: 400 })
    }
    const created = insertTenant(body)
    return HttpResponse.json(created as MockTenant, { status: 201 })
  }),

  http.put('*/tenants/:id', async ({ params, request }) => {
    const id = String(params.id)
    const body = (await request.json()) as Partial<{
      name: string
      theme: { primary: string; sidebar: string; logoText: string }
      features: string[]
      config: { maxUsers: number }
    }>
    const updated = updateTenantRecord(id, body)
    if (!updated) return HttpResponse.json({ message: '租户不存在' }, { status: 404 })
    return HttpResponse.json(updated as MockTenant)
  }),

  http.delete('*/tenants/:id', ({ params }) => {
    const ok = deleteTenantRecord(String(params.id))
    if (!ok) return HttpResponse.json({ message: '租户不存在' }, { status: 404 })
    return new HttpResponse(null, { status: 204 })
  }),
]