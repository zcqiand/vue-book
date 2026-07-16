// src/store/index.js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    // 同步修改状态的唯一入口
    increment(state) {
      state.count++
    },
    add(state, payload) {
      state.count += payload.step
    }
  },
  actions: {
    // 异步或业务逻辑放这里
    incrementAsync({ commit }, payload) {
      setTimeout(() => {
        commit('increment')
      }, payload.delay ?? 0)
    }
  }
})