export default defineEventHandler(() => {
  return {
    now: new Date().toISOString(),
    timezone: 'UTC',
  }
})