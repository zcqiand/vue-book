// server/api/hello.ts
export default defineEventHandler((event) => {
  return {
    message: 'Hello from Nitro server!',
    timestamp: new Date().toISOString()
  }
})