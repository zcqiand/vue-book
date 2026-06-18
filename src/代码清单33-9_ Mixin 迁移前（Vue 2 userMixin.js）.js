// src/mixins/userMixin.js
export default {
  data() {
    return {
      // 多个 Mixin 同时声明 user 字段会静默覆盖，运行时无任何警告
      user: null
    }
  },
  computed: {
    isAdmin() {
      return this.user?.role === 'admin'
    }
  },
  methods: {
    async fetchUser(id) {
      // this.$http 是另一个 Mixin 注入的：隐式依赖，看不见来源
      const res = await this.$http.get('/users/' + id)
      this.user = res.data
    },
    logout() {
      this.user = null
    }
  }
}

// 组件里：import userMixin from '@/mixins/userMixin'; mixins: [userMixin]
// 模板里直接写 {{ user }}，但读者无法判断 user 来自哪个 Mixin