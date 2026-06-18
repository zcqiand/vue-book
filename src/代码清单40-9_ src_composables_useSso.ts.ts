import type { RouteLocationNormalizedLoaded, Router } from 'vue-router'
import { exchangeSsoTicket } from '@/api/auth'
import { useAuthStore } from '@/stores/auth'

const SSO_STATE_KEY = 'chapter40.sso.state'
const SSO_RETURN_TO_KEY = 'chapter40.sso.returnTo'

function createState(): string {
  return crypto.randomUUID()
}

function readStringQuery(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

export function useSso() {
  const authStore = useAuthStore()

  function buildSsoLoginUrl(returnTo: string = window.location.pathname): string {
    const state = createState()
    sessionStorage.setItem(SSO_STATE_KEY, state)
    sessionStorage.setItem(SSO_RETURN_TO_KEY, returnTo)

    const authorizeUrl = new URL(import.meta.env.VITE_SSO_AUTHORIZE_URL ?? 'https://sso.example.com/login')
    authorizeUrl.searchParams.set('client_id', import.meta.env.VITE_SSO_CLIENT_ID ?? 'vue-rbac-demo')
    authorizeUrl.searchParams.set('redirect_uri', `${window.location.origin}/auth/sso/callback`)
    authorizeUrl.searchParams.set('response_type', 'ticket')
    authorizeUrl.searchParams.set('state', state)

    return authorizeUrl.toString()
  }

  function startSsoLogin(returnTo: string = window.location.pathname): void {
    window.location.assign(buildSsoLoginUrl(returnTo))
  }

  async function handleSsoCallback(route: RouteLocationNormalizedLoaded, router: Router): Promise<void> {
    const ticket = readStringQuery(route.query.ticket)
    const idpToken = readStringQuery(route.query.token)
    const state = readStringQuery(route.query.state)
    const expectedState = sessionStorage.getItem(SSO_STATE_KEY)

    if (expectedState !== null && state !== expectedState) {
      throw new Error('SSO state 校验失败，可能是重复回调或跨站请求')
    }

    if (ticket.length === 0 && idpToken.length === 0) {
      throw new Error('SSO 回调缺少 ticket 或 token')
    }

    const returnTo = sessionStorage.getItem(SSO_RETURN_TO_KEY) ?? '/'
    const session = await exchangeSsoTicket({ ticket, idpToken, returnTo })
    authStore.applySession(session)

    sessionStorage.removeItem(SSO_STATE_KEY)
    sessionStorage.removeItem(SSO_RETURN_TO_KEY)

    await router.replace(returnTo)
  }

  function createDemoSsoCallbackUrl(returnTo: string = '/'): string {
    const state = createState()
    sessionStorage.setItem(SSO_STATE_KEY, state)
    sessionStorage.setItem(SSO_RETURN_TO_KEY, returnTo)

    const callbackUrl = new URL('/auth/sso/callback', window.location.origin)
    callbackUrl.searchParams.set('ticket', 'demo-sso-ticket')
    callbackUrl.searchParams.set('state', state)
    return `${callbackUrl.pathname}${callbackUrl.search}`
  }

  return {
    buildSsoLoginUrl,
    startSsoLogin,
    handleSsoCallback,
    createDemoSsoCallbackUrl
  }
}