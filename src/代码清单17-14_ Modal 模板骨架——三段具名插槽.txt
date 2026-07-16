<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="visible" class="modal-mask" @click.self="handleBackdrop">
        <div class="modal-panel" :style="panelStyle">
          <header class="modal-header">
            <slot name="header">
              <span class="default-title">{{ title }}</span>
            </slot>
            <button class="modal-close" @click="close">×</button>
          </header>
          <main class="modal-body">
            <slot>
              <span class="default-body">默认内容</span>
            </slot>
          </main>
          <footer class="modal-footer">
            <slot name="footer">
              <button class="btn-primary" @click="close">确定</button>
            </slot>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>