/**
 * Formats a date value to Vietnamese locale string.
 * @param {string|Date} value - Date value to format.
 * @returns {string} Formatted date string or "--" if invalid.
 */
export const formatDate = (value: unknown): string => {
  if (!value) return '--'
  if (typeof value !== 'string' && !(value instanceof Date)) return '--'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '--'
  return d.toLocaleDateString('vi-VN')
}

/**
 * Formats a value to display, returning "--" for null/undefined/empty.
 * @param {*} value - Value to format.
 * @returns {string} Formatted value or "--".
 */
export const formatValueCell = (value: unknown): string =>
  value === null || value === undefined || value === '' ? '--' : (value as string)
