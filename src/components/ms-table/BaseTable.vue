<script lang="ts" setup generic="T extends BaseRow">
import type { BaseRow, FieldType } from '@/types/baseTable'
import { ref } from 'vue'
import CheckboxField from '@/components/ms-checkbox/BaseCheckbox.vue'
import { formatDate, formatValueCell } from '@/utils/format'
defineOptions({
  name: 'BaseTable',
})

type TableEmits<T extends BaseRow> = {
  // (e: 'delete:rows', data: T): void
  (e: 'edit:row', data: T): void
  (e: 'delete:row', id: string | number): void
}
const emit = defineEmits<TableEmits<T>>()

const props = defineProps<{
  fields: FieldType<T>[]
  rows: T[]
}>()
const selectedAll = ref(false)
const selectedRows = ref<{ [key: string | number]: boolean }>({})
const hoveredRow = ref<string | number | null>(null)
// const handleDeleteRow = (id: string | number) => {
//     emit('delete:row', id)
//   }
const handleEditRow = (row: T) => {
  emit('edit:row', row)
}
// const handleDeleteRows = (rows: T[]) => {
//   emit('delete:rows', rows)
// }
const handleFormatCell = {
  text: formatValueCell,
  number: formatValueCell,
  date: formatDate,
}
</script>
<template>
  <div class="table-wrapper">
    <table class="table">
      <thead class="table__head">
        <tr class="table__row">
          <th class="table__header" id="table-header-checkbox">
            <CheckboxField v-model="selectedAll" />
          </th>
          <th v-for="column in props.fields" :key="column.key" class="table__header">
            {{ column.label }}
          </th>
          <th class="table__header table__header-action"></th>
        </tr>
      </thead>
      <tbody class="table__body">
        <tr
          v-for="row in props.rows"
          :key="row.id"
          class="table__row"
          :class="{
            show: hoveredRow === row.id,
            'table__row--highlighted': row.isHighlighted,
          }"
          @mouseover="hoveredRow = row.id"
          @mouseleave="hoveredRow = null"
        >
          <td class="table__cell table__checkbox-cell">
            <CheckboxField v-model="selectedRows[row.id]" />
          </td>
          <td
            v-for="field in props.fields"
            :key="field.key"
            class="table__cell"
            :class="field.cellCustomClass"
          >
            <template v-if="field.type === 'custom'">
              <slot :name="field.key" :row="row" :field="field">
                {{ row[field.key] }}
              </slot>
            </template>

            <!-- Other types -->
            <template v-else>
              {{ handleFormatCell[field.type](row[field.key]) }}
            </template>
          </td>
          <td class="table__cell table__cell-action">
            <button>
              <div class="icon-default icon-edit" @click="handleEditRow(row)"></div>
            </button>
            <!-- <button><div class="icon-default icon-delete" @click="handleDeleteRow(row.id)"></div></button> -->
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="pagination">
    <div class="pagination__info">
      <span class="pagination__total">Tổng: <strong>5383</strong> bản ghi</span>
    </div>
    <div class="pagination__controls">
      <span class="pagination__text">Số bản ghi/trang</span>
      <select class="pagination__select">
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>
      <span class="pagination__range">1 - 25 bản ghi</span>
      <button class="pagination__btn pagination__btn--prev icon-default icon-left"></button>
      <button class="pagination__btn pagination__btn--next icon-default icon-right"></button>
    </div>
  </div>
</template>
<style scoped src="@/assets/css/candidates/candidate-tableview.css"></style>
