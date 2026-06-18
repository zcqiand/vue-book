// 渲染模式选择指南：

// 场景一：技术博客、内容文档站
// → SSG（nuxt generate），构建时渲染静态 HTML，SEO 最优，服务器成本极低
routeRules: { '/**': { prerender: true } }

// 场景二：电商产品详情页、社交内容页
// → SSR，首屏内容实时，SEO 重要，SSR 成本可接受
// Nuxt 默认 SSR，无需特殊配置

// 场景三：SaaS 管理后台、私人工具
// → CSR（ssr: false），内容私密无 SEO，交互复杂，SSR 成本不划算
routeRules: { '/dashboard/**': { ssr: false } }