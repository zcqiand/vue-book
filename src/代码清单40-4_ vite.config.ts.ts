import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, type Plugin } from 'vite'
import type { IncomingMessage, ServerResponse } from 'node:http'

interface MockUser {
  id: string
  name: string
  email: string
}

interface MockTenant {
  id: string
  name: string
}

interface MockSession {
  accessToken: string
  refreshToken: string
  expiresAt: string
  user: MockUser
  tenantId: string
  roles: string[]
  permissions: string[]
  availableTenants: MockTenant[]
}

const availableTenants: MockTenant[] = [
  { id: 'tenant-acme', name: 'Acme 实验室' },
  { id: 'tenant-beta', name: 'Beta 研究院' }
]

const permissionByTenant: Record<string, { roles: string[]; permissions: string[] }> = {
  'tenant-acme': {
    roles: ['tenant-admin'],
    permissions: ['dashboard:read', 'user:read', 'user:create', 'user:update', 'tenant:manage', 'audit:read']
  },
  'tenant-beta': {
    roles: ['auditor'],
    permissions: ['dashboard:read', 'user:read', 'audit:read']
  }
}

function createMockSession(tenantId: string, loginSource: 'sso' | 'oauth' | 'refresh'): MockSession {
  const authorization = permissionByTenant[tenantId] ?? permissionByTenant['tenant-acme']

  return {
    accessToken: `mock-${loginSource}-access-token-${tenantId}`,
    refreshToken: `mock-${loginSource}-refresh-token-${tenantId}`,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    user: {
      id: loginSource === 'oauth' ? 'user-github-001' : 'user-sso-001',
      name: loginSource === 'oauth' ? 'GitHub 登录用户' : '企业 SSO 用户',
      email: loginSource === 'oauth' ? 'github-user@example.com' : 'sso-user@example.com'
    },
    tenantId,
    roles: authorization.roles,
    permissions: authorization.permissions,
    availableTenants
  }
}

function readJsonBody(req: IncomingMessage): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []

    req.on('data', (chunk: Buffer) => {
      chunks.push(chunk)
    })

    req.on('end', () => {
      const rawBody = Buffer.concat(chunks).toString('utf8')

      if (rawBody.length === 0) {
        resolve({})
        return
      }

      try {
        resolve(JSON.parse(rawBody) as Record<string, unknown>)
      } catch (error) {
        reject(error instanceof Error ? error : new Error('请求体不是合法 JSON'))
      }
    })

    req.on('error', reject)
  })
}

function sendJson(res: ServerResponse, statusCode: number, payload: unknown): void {
  res.statusCode = statusCode
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(payload))
}

function authMockPlugin(): Plugin {
  return {
    name: 'chapter-40-auth-mock-api',
    configureServer(server) {
      server.middlewares.use('/api', async (req, res, next) => {
        const path = req.url?.split('?')[0] ?? ''
        const method = req.method ?? 'GET'

        if (method === 'OPTIONS') {
          sendJson(res, 204, {})
          return
        }

        try {
          if (path === '/auth/sso/exchange' && method === 'POST') {
            const body = await readJsonBody(req)
            const ticket = typeof body.ticket === 'string' ? body.ticket : ''
            const idpToken = typeof body.idpToken === 'string' ? body.idpToken : ''

            if (ticket.length === 0 && idpToken.length === 0) {
              sendJson(res, 400, { message: 'SSO 回调必须携带 ticket 或 token' })
              return
            }

            sendJson(res, 200, createMockSession('tenant-acme', 'sso'))
            return
          }

          if (path === '/auth/oauth/exchange' && method === 'POST') {
            const body = await readJsonBody(req)
            const code = typeof body.code === 'string' ? body.code : ''
            const provider = typeof body.provider === 'string' ? body.provider : ''
            const redirectUri = typeof body.redirectUri === 'string' ? body.redirectUri : ''

            if (code.length === 0 || provider.length === 0 || redirectUri.length === 0) {
              sendJson(res, 400, { message: 'OAuth exchange 缺少 code、provider 或 redirectUri' })
              return
            }

            sendJson(res, 200, createMockSession('tenant-beta', 'oauth'))
            return
          }

          if (path === '/auth/me' && method === 'GET') {
            const url = new URL(req.url ?? '/auth/me', 'http://localhost')
            const tenantId = url.searchParams.get('tenantId') ?? 'tenant-acme'
            const authorization = req.headers.authorization ?? ''

            if (!authorization.startsWith('Bearer ')) {
              sendJson(res, 401, { message: '缺少 Bearer token' })
              return
            }

            sendJson(res, 200, createMockSession(tenantId, 'refresh'))
            return
          }

          next()
        } catch (error) {
          const message = error instanceof Error ? error.message : '服务器处理请求失败'
          sendJson(res, 500, { message })
        }
      })
    }
  }
}

export default defineConfig({
  plugins: [vue(), tailwindcss(), authMockPlugin()],
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})