export default defineEventHandler(() => {
  return {
    message: 'Hello from Nitro!',
    timestamp: new Date().toISOString(),
  }
})