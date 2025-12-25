<script lang="ts" setup generic="T extends BaseRow">
import type { BaseRow, FieldType } from '@/types/baseTable'
import { computed, ref, watch } from 'vue'
import CheckboxField from '@/components/ms-checkbox/BaseCheckbox.vue'
import { formatDate, formatValueCell } from '@/utils/format'
import BaseInput from '@/components/ms-input/BaseInput.vue'
import { useDebounce } from '@/utils/hooks/useDebounce'
defineOptions({
  name: 'BaseTable',
})

type TableEmits<T extends BaseRow> = {
  // (e: 'delete:rows', data: T): void
  (e: 'edit:row', data: T): void
  (e: 'delete:row', id: string | number): void
  (e: 'select:rows', data: unknown): void
  (e: 'prev:page'): void
  (e: 'next:page'): void
  (e: 'change:limit', limit: number): void
  (e: 'search:text', text: string): void
}
const emit = defineEmits<TableEmits<T>>()

const props = defineProps<{
  fields: FieldType<T>[]
  rows: T[]
  query: {
    total: number
    limit: number
    page: number
    searchText: string
  }
}>()

const selectedAll = ref(false)
const selectedRows = ref<{ [key: string | number]: boolean }>({})
const hoveredRow = ref<string | number | null>(null)
const maxPage = computed(() => {
  return Math.ceil(props.query.total / props.query.limit)
})
// const handleDeleteRow = (id: string | number) => {
//     emit('delete:row', id)
//   }
const handleEditRow = (row: T) => {
  emit('edit:row', row)
}

const handleSelectAll = () => {
  selectedAll.value = !selectedAll.value
  props.rows.forEach((row) => {
    selectedRows.value[row.id] = selectedAll.value
  })
  emit('select:rows', selectedRows.value)
}
const handleSelectRow = (row: T) => {
  selectedRows.value[row.id] = !selectedRows.value[row.id]
  emit('select:rows', selectedRows.value)
}
const handleFormatCell = {
  text: formatValueCell,
  number: formatValueCell,
  date: formatDate,
}
const handlePrevPage = () => {
  emit('prev:page')
}
const handleNextPage = () => {
  emit('next:page')
}
const handleChangeLimit = (limit: number) => {
  emit('change:limit', limit)
}

// Debounce search input
const searchInput = ref<string>(props.query.searchText || '')
const debouncedSearchText = useDebounce(searchInput, 500)

// Sync searchInput with prop when it changes externally
watch(
  () => props.query.searchText,
  (newValue) => {
    if (newValue !== searchInput.value) {
      searchInput.value = newValue || ''
    }
  },
)

// Watch debounced value and emit when user stops typing
watch(debouncedSearchText, (newValue) => {
  emit('search:text', newValue)
})
</script>
<template>
  <div class="flex justify-between items-center main__content-filter">
    <div class="main__content-search">
      <div class="input-search-wrapper">
        <span class="input-search__icon input-search__icon--animated"></span>
        <BaseInput
          type="text"
          class="input-search"
          placeholder="Tìm kiếm hoặc nhờ AI trợ giúp"
          v-model="searchInput"
        />
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
  <div class="table-wrapper">
    <table class="table">
      <thead class="table__head">
        <tr class="table__row">
          <th class="table__header" id="table-header-checkbox">
            <div class="table__checkbox-wrapper">
              <CheckboxField v-model="selectedAll" @click="handleSelectAll" />
            </div>
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
            <div class="table__checkbox-wrapper">
              <CheckboxField v-model="selectedRows[row.id]" @click="handleSelectRow(row)" />
            </div>
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
      <span class="pagination__total"
        >Tổng: <strong>{{ query.total }}</strong> bản ghi</span
      >
    </div>
    <div class="pagination__controls">
      <span class="pagination__text">Số bản ghi/trang</span>
      <select
        class="pagination__select"
        @change="(e: Event) => handleChangeLimit(Number((e.target as HTMLSelectElement).value))"
      >
        <option
          v-for="limit in [25, 50, 100]"
          :value="limit"
          :key="limit"
          :selected="limit === query.limit"
        >
          {{ limit }}
        </option>
      </select>
      <span class="pagination__range"
        >{{ (query.page - 1) * query.limit + 1 }} - {{ query.page * query.limit }} bản ghi</span
      >
      <button
        class="pagination__btn pagination__btn--prev icon-default icon-left"
        :disabled="query.page === 1"
        @click="handlePrevPage"
      ></button>
      <button
        class="pagination__btn pagination__btn--next icon-default icon-right"
        :disabled="query.page === maxPage"
        @click="handleNextPage"
      ></button>
    </div>
  </div>
</template>
<style scoped>
/* Table Wrapper */
.table-wrapper {
  flex: 1;
  overflow: auto;
}

.table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 14px;
}

.table__head {
  position: sticky;
  top: 0;
  z-index: 101;
}

.table__header {
  padding: 8px;
  text-align: left;
  font-weight: 700;
  color: #374151;
  white-space: nowrap;
  background-color: #f9fafb;
  border-bottom: 1px solid #e0e6ec;
  border-right: 1px solid #e0e6ec;
  border-top: 1px solid #e0e6ec;
}

.table__header:last-child {
  border-right: none;
}

.table__row {
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 0.2s;
  background-color: #fff;
  height: 48px;
}

.table__row:hover {
  background-color: #e1eeff !important;
}

.table__row--highlighted {
  background-color: #fef2f2;
}

.table__row--highlighted:hover {
  background-color: #fee2e2;
}

.table__cell {
  padding: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
  background-color: inherit;
}
.table__cell.stars {
  text-overflow: unset;
}

.table__header-action,
.table__cell-action {
  position: sticky;
  right: 0;
  transition: all 0.2s;
}
.table__cell-action button {
  opacity: 0;
  visibility: hidden;
  border-radius: 100%;
  background-color: inherit;
}
.table__row.show .table__cell-action button {
  opacity: 1;
  visibility: visible;
}

.table__checkbox-wrapper {
  width: 50px;
}

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
  background-color: #f5f5f5 !important;
}

.pagination__info {
  display: flex;
  align-items: center;
}

.pagination__total {
  font-size: 14px;
  color: #1e2633;
}

.pagination__controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pagination__select {
  padding: 7px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.pagination__text {
  font-size: 14px;
  color: #1e2633;
}

.pagination__range {
  font-size: 14px;
}

.pagination__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination__btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
