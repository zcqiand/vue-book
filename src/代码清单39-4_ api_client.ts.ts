import { useTenantStore } from '@/stores/tenant'

export class ApiError extends Error {
  readonly status: number
  readonly body: unknown

  constructor(message: string, status: number, body: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

function joinUrl(baseUrl: string, path: string): string {
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  return `${normalizedBase}${normalizedPath}`
}

async function readResponseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    return response.json()
  }

  const text = await response.text()
  return text.length > 0 ? text : null
}

export async function apiFetch<TResponse>(path: string, options: RequestInit = {}): Promise<TResponse> {
  const tenantStore = useTenantStore()
  const tenantId = tenantStore.currentTenant?.id

  if (!tenantId) {
    throw new Error('Cannot call API before tenant is initialized.')
  }

  const headers = new Headers(options.headers)
  headers.set('X-Tenant-ID', tenantId)

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const baseUrl = import.meta.env.VITE_API_BASE_URL ?? '/api'
  const response = await fetch(joinUrl(baseUrl, path), {
    ...options,
    headers
  })
  const body = await readResponseBody(response)

  if (!response.ok) {
    throw new ApiError(`API request failed with status ${response.status}.`, response.status, body)
  }

  return body as TResponse
}