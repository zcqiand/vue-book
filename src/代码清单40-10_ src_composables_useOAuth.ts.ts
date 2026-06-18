import type { RouteLocationNormalizedLoaded, Router } from 'vue-router'
import { exchangeOAuthCode } from '@/api/auth'
import { useAuthStore } from '@/stores/auth'
import type { OAuthProvider } from '@/types/auth'

const OAUTH_STATE_PREFIX = 'chapter40.oauth.state.'
const OAUTH_RETURN_TO_PREFIX = 'chapter40.oauth.returnTo.'

const providerAuthorizeUrl: Record<OAuthProvider, string> = {
  github: 'https://github.com/login/oauth/authorize',
  google: 'https://accounts.google.com/o/oauth2/v2/auth'
}

const providerClientId: Record<OAuthProvider, string> = {
  github: import.meta.env.VITE_GITHUB_CLIENT_ID ?? 'github-demo-client-id',
  google: import.meta.env.VITE_GOOGLE_CLIENT_ID ?? 'google-demo-client-id'
}

const providerScope: Record<OAuthProvider, string> = {
  github: 'read:user user:email',
  google: 'openid email profile'
}

function createState(): string {
  return crypto.randomUUID()
}

function readStringQuery(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

export function useOAuth(provider: OAuthProvider) {
  const authStore = useAuthStore()

  function buildAuthorizationUrl(returnTo: string = window.location.pathname): string {
    const state = createState()
    sessionStorage.setItem(`${OAUTH_STATE_PREFIX}${provider}`, state)
    sessionStorage.setItem(`${OAUTH_RETURN_TO_PREFIX}${provider}`, returnTo)

    const redirectUri = `${window.location.origin}/auth/oauth/${provider}/callback`
    const authorizeUrl = new URL(providerAuthorizeUrl[provider])

    authorizeUrl.searchParams.set('client_id', providerClientId[provider])
    authorizeUrl.searchParams.set('redirect_uri', redirectUri)
    authorizeUrl.searchParams.set('response_type', 'code')
    authorizeUrl.searchParams.set('scope', providerScope[provider])
    authorizeUrl.searchParams.set('state', state)

    return authorizeUrl.toString()
  }

  function startOAuthLogin(returnTo: string = window.location.pathname): void {
    window.location.assign(buildAuthorizationUrl(returnTo))
  }

  async function handleOAuthCallback(route: RouteLocationNormalizedLoaded, router: Router): Promise<void> {
    const code = readStringQuery(route.query.code)
    const state = readStringQuery(route.query.state)
    const expectedState = sessionStorage.getItem(`${OAUTH_STATE_PREFIX}${provider}`)

    if (code.length === 0) {
      throw new Error('OAuth 回调缺少 code')
    }

    if (expectedState !== null && state !== expectedState) {
      throw new Error('OAuth state 校验失败，可能是重复回调或跨站请求')
    }

    const redirectUri = `${window.location.origin}/auth/oauth/${provider}/callback`
    const session = await exchangeOAuthCode({ provider, code, redirectUri, state })
    authStore.applySession(session)

    const returnTo = sessionStorage.getItem(`${OAUTH_RETURN_TO_PREFIX}${provider}`) ?? '/'
    sessionStorage.removeItem(`${OAUTH_STATE_PREFIX}${provider}`)
    sessionStorage.removeItem(`${OAUTH_RETURN_TO_PREFIX}${provider}`)

    await router.replace(returnTo)
  }

  function createDemoOAuthCallbackUrl(returnTo: string = '/'): string {
    const state = createState()
    sessionStorage.setItem(`${OAUTH_STATE_PREFIX}${provider}`, state)
    sessionStorage.setItem(`${OAUTH_RETURN_TO_PREFIX}${provider}`, returnTo)

    const callbackUrl = new URL(`/auth/oauth/${provider}/callback`, window.location.origin)
    callbackUrl.searchParams.set('code', `demo-${provider}-authorization-code`)
    callbackUrl.searchParams.set('state', state)
    return `${callbackUrl.pathname}${callbackUrl.search}`
  }

  return {
    buildAuthorizationUrl,
    startOAuthLogin,
    handleOAuthCallback,
    createDemoOAuthCallbackUrl
  }
}