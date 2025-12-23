<script setup lang="ts">
defineOptions({
  name: 'InputField',
})
type Props = {
  label: string
  fieldKey: string
  type?: string
  placeholder?: string
  error?: string | null
  labelClass?: string
  inputClass?: string
  errorClass?: string
  wrapperClass?: string
  required?: boolean
  disabled?: boolean
  // layout: hướng hiển thị label/input, tránh trùng với HTML style attribute
  layout?: 'horizontal' | 'vertical'
}
withDefaults(defineProps<Props>(), {
  label: '',
  fieldKey: '',
  type: 'text',
  placeholder: 'Nhập thông tin',
  error: null,
  labelClass: '',
  inputClass: '',
  errorClass: '',
  wrapperClass: '',
  required: false,
  layout: 'vertical',
})

// Model dùng cho các control text/select/textarea/checkbox
// Cho phép null/boolean để khớp với kiểu dữ liệu của CandidateType,
// khi bind vào DOM sẽ cast sang any để tránh lỗi kiểu của input/select/checkbox.
const model = defineModel<string | number | boolean | null | undefined>({
  default: '',
})
</script>
<template>
  <div class="form-group" :class="[wrapperClass, layout === 'vertical' ? 'flex-col' : '']">
    <label
      class="form-label"
      :class="[labelClass, required ? 'form-label--required' : '']"
      :data-required="required"
      >{{ label }}</label
    >
    <div class="flex flex-col">
      <!--
        Ưu tiên hiển thị theo loại control:
        - Nếu truyền slot "select"  => hiển thị select
        - Nếu truyền slot "textarea" => hiển thị textarea
        - Nếu truyền slot "checkbox" => hiển thị checkbox
        - Ngược lại: dùng input mặc định

        Cách dùng ở component cha:
        - Mặc định input:
          <FormGroup v-model="form.CandidateName" label="Họ và tên" fieldKey="CandidateName" />

        - Dùng select mặc định bên trong:
          <FormGroup v-model="form.Gender" label="Giới tính" fieldKey="Gender">
            <template #select></template>
          </FormGroup>

        - Tự custom select:
          <FormGroup v-model="form.Gender" label="Giới tính" fieldKey="Gender">
            <template #select="{ model, fieldKey }">
              <select class="form-select" :name="fieldKey" v-model="model">
                ...
              </select>
            </template>
          </FormGroup>
      -->

      <!-- SELECT -->
      <template v-if="$slots.select || $slots['select-options']">
        <slot
          name="select"
          :model="model"
          :fieldKey="fieldKey"
          :disabled="disabled"
          :inputClass="inputClass"
          :placeholder="placeholder"
          :error="error"
        >
          <select
            class="form-select"
            :class="inputClass"
            :name="fieldKey"
            :disabled="disabled"
            v-model="model as any"
          >
            <!-- Cho phép custom options qua slot riêng nếu cần -->
            <slot name="select-options">
              <option value="">Chọn {{ label.toLowerCase() }}</option>
            </slot>
          </select>
        </slot>
      </template>

      <!-- TEXTAREA -->
      <template v-else-if="$slots.textarea">
        <slot
          name="textarea"
          :model="model"
          :fieldKey="fieldKey"
          :disabled="disabled"
          :inputClass="inputClass"
          :placeholder="placeholder"
          :error="error"
        >
          <textarea
            class="form-textarea"
            :class="inputClass"
            :name="fieldKey"
            :placeholder="placeholder"
            :disabled="disabled"
            v-model="model as any"
          ></textarea>
        </slot>
      </template>

      <!-- CHECKBOX -->
      <template v-else-if="$slots.checkbox">
        <slot
          name="checkbox"
          :model="model"
          :fieldKey="fieldKey"
          :disabled="disabled"
          :inputClass="inputClass"
          :placeholder="placeholder"
          :error="error"
        >
          <div class="flex items-center gap-2">
            <input
              type="checkbox"
              class="form-input"
              :class="inputClass"
              :name="fieldKey"
              :disabled="disabled"
              v-model="model as any"
            />
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
          :inputClass="inputClass"
          :placeholder="placeholder"
          :error="error"
        >
          <input
            :type="type"
            :disabled="disabled"
            class="form-input"
            :class="inputClass"
            :name="fieldKey"
            :placeholder="placeholder"
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
  margin: 8px 0px;
  display: flex;
}

.form-label {
  display: block;
  font-size: 14px;
  height: 25px;
  line-height: 25px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 6px;
}

.form-label--required::after {
  content: ' *';
  color: #ef4444;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  height: 32px;
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
</style>
