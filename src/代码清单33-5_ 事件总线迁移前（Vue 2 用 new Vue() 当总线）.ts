// src/utils/bus.js
import Vue from 'vue'

// 一个空的 Vue 实例充当中央事件总线：$on 注册、$emit 触发、$off 注销
// Vue 3 已移除这三个 API，此文件无法继续工作
export const bus = new Vue()

// 发送端组件里：bus.$emit('login', user)
// 接收端组件里：bus.$on('login', user => { ... })