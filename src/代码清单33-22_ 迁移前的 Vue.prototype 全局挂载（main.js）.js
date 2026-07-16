// src/main.js
import Vue from 'vue'
import axios from 'axios'

// 给所有组件实例挂上 $http：组件里通过 this.$http.get(...) 调用
Vue.prototype.$http = axios

new Vue({
  render: h => h(App)
}).$mount('#app')