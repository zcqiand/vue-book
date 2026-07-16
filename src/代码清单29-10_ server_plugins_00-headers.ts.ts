export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('request', (event) => {
    // 每个请求到达时执行，可加响应头、记录日志、做限流
    event.node.res.setHeader('X-Frame-Options', 'DENY')
  })
})