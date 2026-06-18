interface ClientConfig {
  apiBase: string
  appTitle: string
  isProduction: boolean
}

function requireEnv(name: string, value: string | undefined): string {
  if (!value || value.trim().length === 0) {
    throw new Error(`${name} 未配置，请检查 .env.development 或 .env.production`)
  }

  return value
}

export const clientConfig: ClientConfig = {
  apiBase: requireEnv('VITE_API_BASE', import.meta.env.VITE_API_BASE),
  appTitle: import.meta.env.VITE_APP_TITLE ?? 'Vue Book App',
  isProduction: import.meta.env.PROD,
}

export function buildApiUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${clientConfig.apiBase}${normalizedPath}`
}