<script setup lang="ts">
import { reactive, ref } from 'vue'
import CandidateTable from './CandidataTable.vue'
import BaseDialog from '@/components/ms-dialog/BaseDialog.vue'
import type { CandidateType } from '@/types/candicates'
import CandidateForm from './CandidateForm.vue'
const stateDialog = reactive<{
  isOpen: boolean
  mode: 'add' | 'edit'
}>({
  isOpen: false,
  mode: 'add',
})
const currentCandidate = ref<CandidateType | null>(null)

// Ref tới CandidateForm để có thể gọi submit() khi bấm nút Lưu ở footer dialog
const candidateFormRef = ref<InstanceType<typeof CandidateForm> | null>(null)
function handleEditRow(row: CandidateType) {
  stateDialog.isOpen = true
  stateDialog.mode = 'edit'
  currentCandidate.value = row
}
function handleSubmit(candidate: CandidateType) {
  console.log('candidate', candidate)
  stateDialog.isOpen = false
}
</script>
<template>
  <div class="main__header">
    <h1 class="main__header-title">Ứng viên</h1>
    <div class="main__header-actions">
      <button
        class="btn-primary flex items-center gap-2 btn-sm h-full main__header-actions-add"
        id="btn-add-candidate"
        @click="stateDialog.isOpen = true"
      >
        <div class="icon-default icon-add bg-white"></div>
        <span> Thêm ứng viên </span>
      </button>
      <button class="btn-primary h-full btn main__header-actions-down">
        <div class="icon-default icon-down bg-white"></div>
      </button>
    </div>
  </div>
  <div class="main__content">
    <div class="flex justify-between items-center main__content-filter">
      <div class="main__content-search">
        <div class="input-search-wrapper">
          <span class="input-search__icon input-search__icon--animated"></span>
          <input type="text" class="input-search" placeholder="Tìm kiếm hoặc nhờ AI trợ giúp" />
        </div>
      </div>
      <div class="main__toolbar flex gap-2">
        <div class="main__toolbar-btn">
          <button class="icon-default icon-filter" title="Lọc"></button>
        </div>
        <div class="main__toolbar-btn">
          <button class="icon-default icon-export" title="Xuất"></button>
        </div>
        <div class="main__toolbar-btn">
          <button class="icon-default icon-interactive-history" title="Làm mới"></button>
        </div>
        <div class="main__toolbar-btn">
          <button class="icon-default icon-setting-column" title="Cài đặt"></button>
        </div>
      </div>
    </div>
    <CandidateTable @edit:row="handleEditRow" />
  </div>
  <BaseDialog
    :isOpen="stateDialog.isOpen"
    :title="stateDialog.mode === 'add' ? 'Thêm ứng viên' : 'Sửa ứng viên'"
    @close="stateDialog.isOpen = false"
  >
    <template #default>
      <CandidateForm
        ref="candidateFormRef"
        :mode="stateDialog.mode"
        :candidate="currentCandidate"
        @submit="handleSubmit"
      />
    </template>
    <template #footer>
      <button
        class="btn btn-secondary btn-cancel"
        id="btn-cancel"
        @click="stateDialog.isOpen = false"
      >
        Hủy
      </button>
      <button class="btn btn-primary btn-save" id="btn-save" @click="candidateFormRef?.submit()">
        Lưu
      </button>
    </template>
  </BaseDialog>
</template>
