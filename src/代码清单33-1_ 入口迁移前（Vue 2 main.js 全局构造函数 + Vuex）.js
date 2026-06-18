import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 关闭生产环境提示：Vue 2 通过全局 Vue.config 配置
// 所有配置都挂在 Vue 这个全局对象上，多应用场景会互相干扰
Vue.config.productionTip = false

// new Vue() 同时承担「创建实例」与「挂载到 DOM」两件事
// router / store 通过选项注入，全局共享同一个 Vue 构造函数
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')