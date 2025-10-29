import { formatDate } from '$/lib/utils/date.functions'

type DateTableComponentProps = {
  value?: string | number | Date | null
  fallbackValue?: string
}
export default function DateTableComponent({
  value,
  fallbackValue,
}: DateTableComponentProps) {
  const formattedValue = formatDate(value)
  if (!formattedValue) return <p>{fallbackValue ?? '-'}</p>
  return <p>{formattedValue}</p>
}
