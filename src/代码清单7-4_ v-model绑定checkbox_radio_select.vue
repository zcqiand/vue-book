<script setup lang="ts">
import { ref } from 'vue'

// ❶ 单个复选框：绑定布尔值
const agreed = ref<boolean>(false)

// ❷ 多个复选框：绑定字符串数组（每个 checkbox 的 value 进出数组）
const hobbies = ref<string[]>([])

// 单选框：绑定被选中项的 value
const gender = ref<string>('')

// 下拉框：绑定被选中 option 的 value
const city = ref<string>('')
</script>

<template>
  <!-- 单个复选框 -->
  <label>
    <input type="checkbox" v-model="agreed" />
    我已阅读并同意协议
  </label>
  <p>是否同意：{{ agreed }}</p>

  <!-- 多个复选框：共享同一个数组 v-model -->
  <div>
    <label><input type="checkbox" value="reading" v-model="hobbies" /> 阅读</label>
    <label><input type="checkbox" value="coding" v-model="hobbies" /> 编程</label>
    <label><input type="checkbox" value="music" v-model="hobbies" /> 音乐</label>
    <p>已选爱好：{{ hobbies.join(', ') || '无' }}</p>
  </div>

  <!-- 单选框 -->
  <div>
    <label><input type="radio" value="male" v-model="gender" /> 男</label>
    <label><input type="radio" value="female" v-model="gender" /> 女</label>
    <p>性别：{{ gender || '未选择' }}</p>
  </div>

  <!-- 下拉框 -->
  <div>
    <select v-model="city">
      <option value="" disabled>请选择城市</option>
      <option value="beijing">北京</option>
      <option value="shanghai">上海</option>
      <option value="shenzhen">深圳</option>
    </select>
    <p>城市：{{ city || '未选择' }}</p>
  </div>
</template>