<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'BaseTextarea',
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

const textareaClasses = computed(() => {
  const baseClass = props.class || ''
  const errorClass = props.error ? 'is-error' : ''
  return [baseClass, errorClass].filter(Boolean)
})
</script>

<template>
  <textarea
    :name="name"
    :disabled="disabled"
    :placeholder="placeholder"
    :class="textareaClasses"
    v-model="model"
  ></textarea>
</template>

