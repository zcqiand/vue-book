<script setup lang="ts">
import { ref } from 'vue'

const username = ref<string>('')
const bio = ref<string>('')
</script>

<template>
  <div>
    <label>用户名</label>
    <!-- ❶ v-model 绑定到 ref，输入时自动更新 username.value -->
    <input v-model="username" type="text" placeholder="请输入用户名" />
    <p>实时显示：{{ username }}</p>
  </div>

  <div>
    <label>个人简介</label>
    <!-- ❷ textarea 同样用 v-model，写在 <textarea> 标签上，不是 value 属性 -->
    <textarea v-model="bio" placeholder="请输入简介"></textarea>
    <p>已输入 {{ bio.length }} 个字符</p>
  </div>
</template>