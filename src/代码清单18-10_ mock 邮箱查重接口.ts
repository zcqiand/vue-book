const TAKEN_EMAILS = ['admin@lab.com', 'demo@lab.com']

export function mockCheckEmail(email: string): Promise<{ taken: boolean }> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ taken: TAKEN_EMAILS.includes(email.toLowerCase()) })
    }, 300)
  })
}