<template>
  <div>
    <h1>服务端渲染的标题</h1>
    <ClientOnly>
      <!-- 这个组件只在客户端渲染 -->
      <BrowserOnlyFeature />
    </ClientOnly>
  </div>
</template>