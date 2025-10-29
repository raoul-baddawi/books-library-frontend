import 'react-datepicker/dist/react-datepicker.css'
import './date-picker.scss'

import { CalendarIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker'

import { cn } from '$/lib/utils/styling'

import { useEnhancedTable } from '../EnhancedTableProvider'

interface Props extends Partial<ReactDatePickerProps> {
  onChangeDate?: (startDate: string | null, endDate: string | null) => void
  className?: string
  singleDate?: boolean
  name?: string
  placeholder?: string
  initialValue?: Date | [Date | null, Date | null]
}

const formatDateAsString = (date: Date | null): string | null => {
  if (!date) return null
  // Format as YYYY-MM-DD to avoid timezone issues
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

type FilterValueType =
  | string
  | { startDate: string | null; endDate: string | null }

export default function EnhancedTableDatePicker({
  onChangeDate,
  className,
  singleDate = false,
  name,
  placeholder,
  initialValue,
  ...rest
}: Props) {
  const { handleSetFilters } = useEnhancedTable<
    unknown,
    unknown,
    { [key: string]: Partial<FilterValueType> }
  >()

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ])
  const [startDate, endDate] = dateRange
  const [isFocused, setIsFocused] = useState(false)

  const formatter = new Intl.DateTimeFormat('fr-FR')

  const handleOnChange = (date: [Date | null, Date | null] | Date | null) => {
    let newStartDate: Date | null = null
    let newEndDate: Date | null = null

    if (singleDate) {
      newStartDate = date as Date
      setDateRange([newStartDate, null])
    } else {
      const [start, end] = date as [Date | null, Date | null]
      newStartDate = start
      newEndDate = end
      setDateRange([newStartDate, newEndDate])
    }

    onChangeDate?.(
      formatDateAsString(newStartDate),
      formatDateAsString(newEndDate),
    )

    if (name) {
      if (singleDate) {
        const formattedDate = formatDateAsString(newStartDate)
        if (formattedDate) {
          handleSetFilters(name, formattedDate)
        }
      } else {
        handleSetFilters(name, {
          startDate: formatDateAsString(newStartDate),
          endDate: formatDateAsString(newEndDate),
        })
      }
    }
  }

  const defaultValue = useMemo(() => {
    if (initialValue) {
      return initialValue
    }
    return null
  }, [initialValue])

  useEffect(() => {
    if (defaultValue !== undefined) {
      if (defaultValue instanceof Date) {
        setDateRange([defaultValue, null])
      } else if (Array.isArray(defaultValue)) {
        setDateRange([defaultValue[0], defaultValue[1]])
      } else if (typeof defaultValue === 'string') {
        setDateRange([new Date(defaultValue), null])
      }
    }
  }, [defaultValue])

  const getDisplayText = () => {
    if (singleDate) {
      return startDate
        ? formatter.format(startDate)
        : placeholder || 'JJ/MM/AAAA'
    } else {
      if (!startDate && !endDate) {
        return placeholder || 'JJ/MM/AAAA - JJ/MM/AAAA'
      } else {
        const startText = startDate ? formatter.format(startDate) : ''
        const endText = endDate ? formatter.format(endDate) : ''
        return `${startText}${endDate ? ` - ${endText}` : ''}`
      }
    }
  }

  const displayText = getDisplayText()
  const hasValue = singleDate ? !!startDate : !!(startDate || endDate)

  return (
    <ReactDatePicker
      {...rest}
      tabIndex={0}
      calendarClassName={cn(
        '!border !border-neutral-light bg-white !shadow-lg',
        rest.calendarClassName,
      )}
      className={cn('w-full', className)}
      selectsRange={!singleDate}
      startDate={startDate}
      endDate={singleDate ? null : endDate}
      selected={singleDate ? startDate : null}
      onChange={handleOnChange}
      onCalendarOpen={() => setIsFocused(true)}
      onCalendarClose={() => setIsFocused(false)}
      isClearable
      customInput={
        <div className="relative h-11 w-full focus:border-none focus:ring-0 focus:outline-none sm:w-64">
          <div
            className={cn(
              'flex h-full w-full min-w-60 items-center rounded-md border! border-neutral-light! px-3 py-2',
              isFocused && 'border-primary! ring-1 ring-primary/25',
              'focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/25',
            )}
          >
            <div className="flex flex-1 items-center">
              <span
                className={cn(
                  'text-sm',
                  hasValue ? 'text-accent' : 'text-neutral-medium/60',
                )}
              >
                {displayText}
              </span>
            </div>
            <CalendarIcon
              className={cn(
                'text-gray-400 ml-2 h-4 w-4 cursor-pointer',
                isFocused && 'text-primary',
              )}
            />
          </div>
        </div>
      }
    />
  )
}
