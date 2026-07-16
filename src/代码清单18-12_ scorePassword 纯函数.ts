export interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4
  tips: string[]
}

export function scorePassword(pwd: string): PasswordStrength {
  const tips: string[] = []
  let score = 0
  if (pwd.length >= 8) score++; else tips.push('至少 8 个字符')
  if (/[A-Z]/.test(pwd)) score++; else tips.push('包含大写字母')
  if (/[a-z]/.test(pwd)) score++; else tips.push('包含小写字母')
  if (/\d/.test(pwd)) score++; else tips.push('包含数字')
  return { score: score as 0 | 1 | 2 | 3 | 4, tips }
}