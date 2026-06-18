import type { RouteLocationNormalizedLoaded, Router } from 'vue-router'
import { exchangeSsoTicket } from '@/api/auth'
import { useAuthStore } from '@/stores/auth'

const SSO_STATE_KEY = 'saas-sso-state'
const SSO_RETURN_TO_KEY = 'saas-sso-return-to'

function createState(): string {
  return crypto.randomUUID()
}

function readQuery(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

export function useSso() {
  const authStore = useAuthStore()

  function buildSsoLoginUrl(returnTo: string = window.location.pathname): string {
    const state = createState()
    sessionStorage.setItem(SSO_STATE_KEY, state)
    sessionStorage.setItem(SSO_RETURN_TO_KEY, returnTo)

    const url = new URL(import.meta.env.VITE_SSO_AUTHORIZE_URL ?? 'https://sso.example.com/login')
    url.searchParams.set('client_id', import.meta.env.VITE_SSO_CLIENT_ID ?? 'vue-saas-demo')
    url.searchParams.set('redirect_uri', `${window.location.origin}/auth/sso/callback`)
    url.searchParams.set('response_type', 'ticket')
    url.searchParams.set('state', state)

    return url.toString()
  }

  function startSsoLogin(returnTo?: string): void {
    window.location.assign(buildSsoLoginUrl(returnTo))
  }

  async function handleSsoCallback(route: RouteLocationNormalizedLoaded, router: Router): Promise<void> {
    const ticket = readQuery(route.query.ticket)
    const idpToken = readQuery(route.query.token)
    const state = readQuery(route.query.state)
    const expectedState = sessionStorage.getItem(SSO_STATE_KEY)

    if (expectedState === null || state.length === 0 || state !== expectedState) {
      throw new Error('SSO state 校验失败')
    }

    if (ticket.length === 0 && idpToken.length === 0) {
      throw new Error('SSO 回调缺少 ticket 或 token')
    }

    const returnTo = sessionStorage.getItem(SSO_RETURN_TO_KEY) ?? '/'
    const session = await exchangeSsoTicket({ ticket, idpToken, returnTo, state })
    await authStore.applySession(session)

    sessionStorage.removeItem(SSO_STATE_KEY)
    sessionStorage.removeItem(SSO_RETURN_TO_KEY)

    await router.replace(returnTo)
  }

  return {
    buildSsoLoginUrl,
    startSsoLogin,
    handleSsoCallback
  }
}