// server/routes/cache-purge.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  // 调用 Nitro 提供的失效 API，让指定路由下次请求时重新生成
  await hubCache.purge(body.path)
  return { ok: true }
})