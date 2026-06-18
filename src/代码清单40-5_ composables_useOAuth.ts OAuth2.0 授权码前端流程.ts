import type { RouteLocationNormalizedLoaded, Router } from 'vue-router'
import { exchangeOAuthCode } from '@/api/auth'
import { useAuthStore } from '@/stores/auth'
import type { OAuthProvider } from '@/types/auth'

const OAUTH_STATE_PREFIX = 'saas-oauth-state-'
const OAUTH_RETURN_TO_PREFIX = 'saas-oauth-return-to-'

const authorizeUrlByProvider: Record<OAuthProvider, string> = {
  github: 'https://github.com/login/oauth/authorize',
  google: 'https://accounts.google.com/o/oauth2/v2/auth'
}

const clientIdByProvider: Record<OAuthProvider, string> = {
  github: import.meta.env.VITE_GITHUB_CLIENT_ID ?? 'github-demo-client-id',
  google: import.meta.env.VITE_GOOGLE_CLIENT_ID ?? 'google-demo-client-id'
}

const scopeByProvider: Record<OAuthProvider, string> = {
  github: 'read:user user:email',
  google: 'openid email profile'
}

function createState(): string {
  return crypto.randomUUID()
}

function readQuery(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

export function useOAuth(provider: OAuthProvider) {
  const authStore = useAuthStore()

  function buildAuthorizationUrl(returnTo: string = window.location.pathname): string {
    const state = createState()
    sessionStorage.setItem(`${OAUTH_STATE_PREFIX}${provider}`, state)
    sessionStorage.setItem(`${OAUTH_RETURN_TO_PREFIX}${provider}`, returnTo)

    const redirectUri = `${window.location.origin}/auth/oauth/${provider}/callback`
    const url = new URL(authorizeUrlByProvider[provider])
    url.searchParams.set('client_id', clientIdByProvider[provider])
    url.searchParams.set('redirect_uri', redirectUri)
    url.searchParams.set('response_type', 'code')
    url.searchParams.set('scope', scopeByProvider[provider])
    url.searchParams.set('state', state)

    return url.toString()
  }

  function startOAuthLogin(returnTo?: string): void {
    window.location.assign(buildAuthorizationUrl(returnTo))
  }

  async function handleOAuthCallback(route: RouteLocationNormalizedLoaded, router: Router): Promise<void> {
    const code = readQuery(route.query.code)
    const state = readQuery(route.query.state)
    const expectedState = sessionStorage.getItem(`${OAUTH_STATE_PREFIX}${provider}`)

    if (code.length === 0) {
      throw new Error('OAuth 回调缺少 code')
    }

    if (expectedState === null || state.length === 0 || state !== expectedState) {
      throw new Error('OAuth state 校验失败')
    }

    const redirectUri = `${window.location.origin}/auth/oauth/${provider}/callback`
    const session = await exchangeOAuthCode({ provider, code, redirectUri, state })
    await authStore.applySession(session)

    const returnTo = sessionStorage.getItem(`${OAUTH_RETURN_TO_PREFIX}${provider}`) ?? '/'
    sessionStorage.removeItem(`${OAUTH_STATE_PREFIX}${provider}`)
    sessionStorage.removeItem(`${OAUTH_RETURN_TO_PREFIX}${provider}`)

    await router.replace(returnTo)
  }

  return {
    buildAuthorizationUrl,
    startOAuthLogin,
    handleOAuthCallback
  }
}