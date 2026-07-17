<script setup lang="ts">
import { reactive, ref } from 'vue'

// (a) ref 基本类型
const aCount = ref<number>(0)
function aInc(): void { aCount.value++ }
function aReset(): void { aCount.value = 0 }

// (b) reactive 对象
const bState = reactive({ count: 0 })
function bInc(): void { bState.count++ }
function bReset(): void { Object.assign(bState, { count: 0 }) }

// (c) ref 包装对象
const cWrapper = ref({ count: 0 })
function cInc(): void { cWrapper.value.count++ }
function cReset(): void { cWrapper.value = { count: 0 } }
</script>

<template>
  <section>
    <h3>(a) ref(0) —— 基本类型</h3>
    <p>{{ aCount }}</p>
    <button @click="aInc">加 1</button>
    <button @click="aReset">重置</button>

    <h3>(b) reactive({ count: 0 }) —— 对象代理</h3>
    <p>{{ bState.count }}</p>
    <button @click="bInc">加 1</button>
    <button @click="bReset">重置（Object.assign）</button>

    <h3>(c) ref({ count: 0 }) —— ref 包对象</h3>
    <p>{{ cWrapper.count }}</p>
    <button @click="cInc">加 1</button>
    <button @click="cReset">重置（整体替换 .value）</button>
  </section>
</template>