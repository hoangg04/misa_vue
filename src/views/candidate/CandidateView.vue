<script setup lang="ts">
import { reactive, ref } from 'vue'
import CandidateTable from './CandidataTable.vue'
import BaseDialog from '@/components/ms-dialog/BaseDialog.vue'
import type { CandidateType } from '@/types/candicates'
import CandidateForm from './CandidateForm.vue'
import { candidateDataStorage } from '@/utils/instances'
const stateDialog = reactive<{
  isOpen: boolean
  mode: 'add' | 'edit'
}>({
  isOpen: false,
  mode: 'add',
})
const currentCandidate = ref<CandidateType | null>(null)

// Ref tới CandidateTable để có thể gọi reload() sau khi thêm/sửa
const candidateTableRef = ref<InstanceType<typeof CandidateTable> | null>(null)

// Ref tới CandidateForm để có thể gọi submit() khi bấm nút Lưu ở footer dialog
const candidateFormRef = ref<InstanceType<typeof CandidateForm> | null>(null)
function handleEditRow(row: CandidateType) {
  stateDialog.isOpen = true
  stateDialog.mode = 'edit'
  currentCandidate.value = row
}
function handleSubmit(candidate: CandidateType) {
  const candidates = candidateDataStorage.get({ Candidates: [] } as { Candidates: CandidateType[] })
  if (stateDialog.mode === 'add') {
    candidateDataStorage.set({
      Candidates: [candidate, ...candidates.Candidates],
    })
  } else {
    candidates.Candidates = candidates.Candidates.map((c) =>
      c.CandidateID === candidate.CandidateID
        ? {
            ...c,
            ...candidate,
            IsTalentPoolDetail: candidate.IsTalentPoolDetail ? 1 : 0,
          }
        : c,
    )
    candidateDataStorage.set({
      Candidates: candidates.Candidates,
    })
  }
  stateDialog.isOpen = false
  currentCandidate.value = null
  // Reload lại dữ liệu bảng sau khi cập nhật storage
  candidateTableRef.value?.reload?.()
}

function handleCloseDialog() {
  stateDialog.isOpen = false
  currentCandidate.value = null
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
    <CandidateTable ref="candidateTableRef" @edit:row="handleEditRow" />
  </div>
  <BaseDialog
    :isOpen="stateDialog.isOpen"
    :title="stateDialog.mode === 'add' ? 'Thêm ứng viên' : 'Sửa ứng viên'"
    @close="handleCloseDialog"
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
      <button class="btn btn-cancel" id="btn-cancel" @click="stateDialog.isOpen = false">
        Hủy
      </button>
      <button class="btn btn-primary btn-save" id="btn-save" @click="candidateFormRef?.submit()">
        Lưu
      </button>
    </template>
  </BaseDialog>
</template>
