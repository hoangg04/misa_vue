<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'BaseSelect',
})

type Props = {
  placeholder?: string
  disabled?: boolean
  name?: string
  error?: boolean | string | null
  class?: string | string[]
  modelValue?: string | number | null | undefined
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
  disabled: false,
  name: undefined,
  error: false,
  class: undefined,
  modelValue: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | null | undefined]
}>()

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const hasValue = computed(() => {
  return model.value !== '' && model.value !== null && model.value !== undefined
})

const selectClasses = computed(() => {
  const baseClass = props.class || ''
  const errorClass = props.error ? 'is-error' : ''
  const valueClass = hasValue.value ? 'has-value' : ''
  return [baseClass, errorClass, valueClass].filter(Boolean)
})
</script>

<template>
  <select
    :name="name"
    :disabled="disabled"
    :class="selectClasses"
    v-model="model"
  >
    <slot>
      <option v-if="placeholder" value="">{{ placeholder }}</option>
    </slot>
  </select>
</template>

