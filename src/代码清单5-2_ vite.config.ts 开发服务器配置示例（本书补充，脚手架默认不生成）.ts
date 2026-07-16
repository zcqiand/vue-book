// 接在 defineConfig({ ... }) 内，与 plugins / resolve 同级
server: {
  port: 5173, // 开发服务器端口（不写也是 5173，这是 Vite 内置默认值）
  open: false, // 启动时是否自动打开浏览器
  proxy: {
    // 联调时把以 /api 开头的请求代理到后端，绕过浏览器跨域限制
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    },
  },
}