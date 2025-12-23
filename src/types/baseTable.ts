export interface FieldType<T> {
  key: keyof T
  label: string
  type: 'number' | 'text' | 'custom' | 'date'
  cellCustomClass?: string
}
export interface BaseRow {
  id: string | number
  isHighlighted?: boolean
}
