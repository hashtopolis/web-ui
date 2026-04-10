export interface DialogData<T extends Record<string, unknown>> {
  icon?: string
  title: string
  body?: string
  warn?: boolean
  cancelLabel?: string
  okLabel?: string
  rows: T[],
  action: string,
  listAttribute?: string
}