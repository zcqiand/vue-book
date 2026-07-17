<template>
  <div>
    <!-- 头部 SSR 安全的部分 -->
    <Header />

    <!-- 隔离可疑子树，看警告是否消失 -->
    <ClientOnly>
      <SuspiciousChart :data="chartData" />
      <template #fallback>
        <div>加载中...</div>
      </template>
    </ClientOnly>
  </div>
</template>