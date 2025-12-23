<script setup lang="ts">
defineOptions({
  name: 'CheckboxField',
})
const model = defineModel<boolean>()
</script>

<template>
  <div class="checkbox-wrapper">
    <input type="checkbox" class="input-checkbox" v-model="model" />
  </div>
</template>

<style scoped>
/* Checkbox wrapper styles - only for table checkboxes */
.checkbox-wrapper {
  width: 50px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

/* Table checkbox input styles */
.input-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #2680eb;
  border-radius: 4px;
  border: 2px solid #7a8188;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  position: relative;
  transition: all 0.2s ease;
}

.input-checkbox:checked {
  background-color: #2680eb;
  border-color: #2680eb;
}

.input-checkbox:checked::after {
  content: '';
  position: absolute;
  left: 4px;
  top: 1px;
  width: 6px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.input-checkbox:hover {
  border-color: #2680eb;
}

.input-checkbox:focus {
  outline: 2px solid rgba(38, 128, 235, 0.2);
  outline-offset: 2px;
}
</style>
