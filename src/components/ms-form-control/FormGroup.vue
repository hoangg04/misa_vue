<script setup lang="ts">
import { computed } from 'vue'
import BaseCheckbox from '../ms-checkbox/BaseCheckbox.vue'
import BaseInput from '../ms-input/BaseInput.vue'
import BaseSelect from '../ms-select/BaseSelect.vue'
import BaseTextarea from '../ms-textarea/BaseTextarea.vue'

defineOptions({
  name: 'InputField',
})
type Props = {
  label: string
  fieldKey: string
  type?: string
  placeholder?: string
  error?: string | null
  labelAttribute?: {
    style?: string | string[]
    class?: string | string[]
  }
  controlAttribute?: {
    style?: string | string[]
    class?: string | string[]
  }
  errorClass?: string
  wrapperAttribute?: {
    style?: string | string[]
    class?: string | string[]
  }
  required?: boolean
  disabled?: boolean
  // layout: hướng hiển thị label/input, tránh trùng với HTML style attribute
  layout?: 'horizontal' | 'vertical'
  reverse?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  label: '',
  fieldKey: '',
  type: 'text',
  placeholder: 'Nhập thông tin',
  error: null,
  labelAttribute: undefined,
  controlAttribute: undefined,
  errorClass: undefined,
  wrapperAttribute: undefined,
  required: false,
  layout: 'vertical',
  reverse: false,
})

// Model dùng cho các control text/select/textarea/checkbox
// Cho phép null/boolean để khớp với kiểu dữ liệu của CandidateType,
// khi bind vào DOM sẽ cast sang any để tránh lỗi kiểu của input/select/checkbox.
const model = defineModel<string | number | boolean | null | undefined>()
const layoutClass = computed(() => {
  return [
    props.wrapperAttribute?.class,
    props.layout === 'vertical' ? 'flex-col' : '',
    props.reverse ? (props.layout === 'horizontal' ? 'flex-row-reverse' : 'flex-col-reverse') : '',
  ]
})
</script>
<template>
  <div class="form-group" :class="layoutClass">
    <label
      :class="[labelAttribute?.class, required ? 'form-label--required' : '', 'form-label']"
      :style="labelAttribute?.style"
      :data-required="required"
    >
      <slot v-if="$slots.label" name="label"></slot>
      {{ label }}
    </label>
    <div class="form-control" :class="controlAttribute?.class" :style="controlAttribute?.style">
      <!-- SELECT -->
      <template v-if="$slots.select || $slots['select-options']">
        <slot
          name="select"
          :model="model"
          :fieldKey="fieldKey"
          :disabled="disabled"
          :placeholder="placeholder"
          :error="error"
        >
          <BaseSelect
            class="form-select"
            :name="fieldKey"
            :disabled="disabled"
            :error="error"
            :placeholder="`Chọn ${label.toLowerCase()}`"
            v-model="model as any"
          >
            <slot name="select-options">
              <option value="">Chọn {{ label.toLowerCase() }}</option>
            </slot>
          </BaseSelect>
        </slot>
      </template>

      <!-- TEXTAREA -->
      <template v-else-if="$slots.textarea">
        <slot
          name="textarea"
          :model="model"
          :fieldKey="fieldKey"
          :disabled="disabled"
          :placeholder="placeholder"
          :error="error"
        >
          <BaseTextarea
            class="form-textarea"
            :name="fieldKey"
            :placeholder="placeholder"
            :disabled="disabled"
            :error="error"
            v-model="model as any"
          />
        </slot>
      </template>

      <template v-else-if="$slots.checkbox">
        <slot
          name="checkbox"
          :model="model"
          :fieldKey="fieldKey"
          :disabled="disabled"
          :placeholder="placeholder"
          :error="error"
        >
          <div class="flex items-center gap-2">
            <base-checkbox v-model="model as any" />
          </div>
        </slot>
      </template>

      <!-- INPUT MẶC ĐỊNH -->
      <template v-else>
        <slot
          name="input"
          :model="model"
          :fieldKey="fieldKey"
          :type="type"
          :disabled="disabled"
          :placeholder="placeholder"
          :error="error"
        >
          <BaseInput
            :type="type"
            :disabled="disabled"
            class="form-input"
            :name="fieldKey"
            :placeholder="placeholder"
            :error="error"
            v-model="model as any"
          />
        </slot>
      </template>

      <span v-if="error" class="form-error" :data-field="fieldKey" :class="errorClass">{{
        error
      }}</span>
    </div>
  </div>
</template>

<style scoped>
.form-group {
  display: flex;
}

.form-label {
  display: inline-flex;
  align-items: center;
  font-size: 14px;
  height: 25px;
  line-height: 25px;
  font-weight: 600;
  color: #1f2937;
}
.form-control {
  display: flex;
  flex-direction: column;
}

.form-label--required::after {
  content: ' *';
  color: #ef4444;
  margin-left: 4px;
  margin-top: 4px;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  height: 34px;
  /* Requested height */
  padding: 0 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  color: #1e2633;
  transition: border-color 0.2s;
  outline: none;
  font-family: inherit;
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: #9ca3af;
}
.form-select {
  color: #9ca3af; /* Màu xám cho placeholder */
}

.form-select option:first-child {
  color: #9ca3af; /* Màu xám cho option placeholder */
}

.form-select option:not(:first-child) {
  color: #1e2633; /* Màu đen cho các option khác */
}

/* Màu đen khi đã chọn giá trị */
.form-select.has-value {
  color: #1e2633;
}
.form-textarea {
  height: auto;
  min-height: 80px;
  padding: 8px 12px;
  resize: vertical;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.form-input:hover,
.form-select:hover,
.form-textarea:hover {
  border-color: #3b82f6;
}
.form-error {
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
  min-height: 16px;
}

.form-input.is-error,
.form-select.is-error,
.form-textarea.is-error {
  border-color: #ef4444;
}

.form-input.is-error:focus,
.form-select.is-error:focus,
.form-textarea.is-error:focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.1);
}
</style>
