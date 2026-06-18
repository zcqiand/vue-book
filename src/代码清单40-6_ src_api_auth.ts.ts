import type { AuthSession, OAuthExchangeRequest, SsoExchangeRequest } from '@/types/auth'

const API_BASE = '/api'

async function requestJson<TResponse>(path: string, init: RequestInit): Promise<TResponse> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers ?? {})
    }
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText.length > 0 ? errorText : `请求失败：HTTP ${response.status}`)
  }

  return (await response.json()) as TResponse
}

export function exchangeSsoTicket(payload: SsoExchangeRequest): Promise<AuthSession> {
  return requestJson<AuthSession>('/auth/sso/exchange', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function exchangeOAuthCode(payload: OAuthExchangeRequest): Promise<AuthSession> {
  return requestJson<AuthSession>('/auth/oauth/exchange', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function refreshSessionByTenant(accessToken: string, tenantId: string): Promise<AuthSession> {
  const params = new URLSearchParams({ tenantId })

  return requestJson<AuthSession>(`/auth/me?${params.toString()}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
}