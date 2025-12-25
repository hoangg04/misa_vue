import { ref, watch, onUnmounted, type MaybeRef } from 'vue'

export const useDebounce = (value: MaybeRef<string>, delay: number) => {
  const debouncedValue = ref<string>(typeof value === 'string' ? value : value.value)
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  const stopWatcher = watch(
    () => (typeof value === 'string' ? value : value.value),
    (newValue) => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      timeoutId = setTimeout(() => {
        debouncedValue.value = newValue
      }, delay)
    },
    { immediate: false },
  )

  onUnmounted(() => {
    stopWatcher()
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  })

  return debouncedValue
}
