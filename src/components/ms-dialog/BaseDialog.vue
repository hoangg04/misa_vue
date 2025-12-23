<script setup lang="ts">
defineOptions({
  name: 'BaseDialog',
})
type Props = {
  title: string
  isOpen: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Tiêu đề',
  isOpen: false,
})
const emit = defineEmits<{
  (e: 'close'): void
}>()
const closeDialog = () => {
  emit('close')
}
</script>

<template>
  <div class="modal-overlay" v-if="props.isOpen">
    <div class="modal">
      <header class="modal__header">
        <h2 class="modal__title">{{ props.title }}</h2>
        <button
          class="modal__close icon-closed icon-default"
          id="btn-close-modal"
          title="Đóng"
          @click="closeDialog"
        ></button>
      </header>

      <div class="modal__body">
        <slot></slot>
      </div>

      <div v-if="$slots.footer" class="modal__footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>
<style scoped>
/* Candidate Form Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transition: all 0.2s ease;
}

.modal-overlay.is-visible {
  opacity: 1;
  visibility: visible;
}

.modal {
  background-color: #fff;
  width: 560px;
  max-width: 95vw;
  height: 95vh;
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.modal__header {
  margin: 24px 16px 0 24px;
  display: flex;
  justify-content: space-between;
}

.modal__title {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.modal__close:hover {
  color: #1f2937;
}

.modal__body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  font-size: 14px;
}

.modal__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100% !important;
  height: 56px !important;
  padding: 9px 24px !important;
  border-top: 1px solid #dddde4;
  background-color: #f1f2f5 !important;
  border-radius: 4px;
}
</style>
