<template>
  <div class="input-wrapper">
    <label>{{ label }}</label>
    <input v-model="modelValue" type="text" />
    <span v-if="localError" class="error-msg">{{ localError }}</span>
  </div>
</template>