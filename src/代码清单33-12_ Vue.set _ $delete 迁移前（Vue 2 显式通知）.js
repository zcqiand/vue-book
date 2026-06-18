export default {
  data() {
    return {
      profile: { name: 'Tom', age: 20 }
    }
  },
  methods: {
    addField() {
      // 直接 this.profile.email = '...' 不会触发视图更新：Vue 2 拦截不到新属性
      // 必须用 Vue.set 显式告知响应式系统「这是个新属性，请追踪它」
      this.$set(this.profile, 'email', 'tom@example.com')
    },
    removeField() {
      // delete this.profile.age 同样不触发更新，必须走 $delete
      this.$delete(this.profile, 'age')
    }
  }
}