import { Command } from 'cmdk'
import { CheckCircle2Icon, ChevronDown, TextSearchIcon } from 'lucide-react'
import { Popover as PopoverPrimitive } from 'radix-ui'
import {
  type ComponentProps,
  Fragment,
  useCallback,
  useEffect,
  useState,
} from 'react'

import { cn } from '$/lib/utils/styling'

import DotLoader from '../../loaders/DotLoader'

export interface ComboboxInputProps<T extends string | string[]>
  extends ComponentProps<'button'> {
  value?: T
  defaultValue?: T
  search?: string
  hasSearch?: boolean
  placeholder?: string
  options: Array<{
    value: string | number
    label: string
    selected?: boolean
  }>
  onSelectValue?: (value: string) => void
  onSearchChange?: (search: string) => void
  disabledOptions?: (string | number)[]
}

interface AsyncComboboxInputProps<T extends string | string[]>
  extends ComboboxInputProps<T> {
  isLoading?: boolean
  isErrored?: boolean
}

interface ComboboxInputBaseProps<T extends string | string[]>
  extends AsyncComboboxInputProps<T> {
  open: boolean
  valueLabel?: string
  onOpenChange: (open: boolean) => void
  onSelectValue: (value: string) => void
}

export default function ComboboxInput(props: ComboboxInputProps<string>) {
  return <SingleValueComboboxInputBase {...props} />
}

ComboboxInput.Multi = function (props: ComboboxInputProps<string[]>) {
  return <MultiValueComboboxInputBase {...props} />
}

ComboboxInput.Async = function (props: AsyncComboboxInputProps<string>) {
  return <SingleValueComboboxInputBase {...props} />
}

ComboboxInput.MultiAsync = function (props: AsyncComboboxInputProps<string[]>) {
  return <MultiValueComboboxInputBase {...props} />
}

function SingleValueComboboxInputBase(
  props: ComboboxInputProps<string> | AsyncComboboxInputProps<string>,
) {
  const [open, setOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState(
    props.defaultValue || props.value || '',
  )
  const [valueLabel, setValueLabel] = useState('')

  useEffect(() => {
    if (selectedValue) {
      const option = props.options.find(
        (option) => option.value === selectedValue,
      )
      setValueLabel(option ? option.label : '')
    }
  }, [selectedValue, props.options])

  const { onSelectValue } = props
  const handleSelectValue = useCallback(
    (value: string) => {
      setSelectedValue(value)
      if (onSelectValue !== undefined) {
        onSelectValue(value)
      }
      setOpen(false)
    },
    [onSelectValue],
  )

  return (
    <ComboboxInputBase<string>
      {...props}
      value={selectedValue}
      valueLabel={valueLabel}
      onSelectValue={handleSelectValue}
      open={open}
      onOpenChange={setOpen}
    />
  )
}

function MultiValueComboboxInputBase(
  props: ComboboxInputProps<string[]> | AsyncComboboxInputProps<string[]>,
) {
  const [open, setOpen] = useState(false)
  const [selectedValues, setSelectedValue] = useState(
    props.defaultValue || props.value || [],
  )

  const { onSelectValue } = props
  const handleSelectValue = useCallback(
    (value: string) => {
      setSelectedValue((prev) => {
        const isSelected = prev.includes(value)
        const newValues = isSelected
          ? prev.filter((v) => v !== value)
          : [...prev, value]

        return newValues
      })
      if (onSelectValue !== undefined) {
        onSelectValue(value)
      }
    },
    [onSelectValue],
  )

  return (
    <ComboboxInputBase<string[]>
      {...props}
      value={selectedValues}
      onSelectValue={handleSelectValue}
      open={open}
      onOpenChange={setOpen}
    />
  )
}

function ComboboxInputBase<T extends string | string[]>(
  props: ComboboxInputBaseProps<T>,
) {
  const {
    open,
    search,
    hasSearch,
    value,
    options,
    isLoading,
    isErrored,
    valueLabel,
    placeholder,
    onOpenChange,
    onSearchChange,
    onSelectValue,
    disabledOptions,
    onChange: _onChange,
    onBlur: _onBlur,
    defaultValue: _defaultValue,
    ...buttonProps
  } = props

  return (
    <PopoverPrimitive.Root modal open={open} onOpenChange={onOpenChange}>
      <PopoverPrimitive.Trigger asChild>
        <button
          aria-label="Customise options"
          className={cn(
            "group flex w-full justify-between rounded-lg border border-border bg-white px-4 py-2.5 text-sm outline-hidden duration-200 focus-within:outline-primary focus:border-accent disabled:cursor-not-allowed disabled:opacity-50 data-placeholder:text-grey data-[state='open']:border-accent aria-invalid:border-danger focus:aria-invalid:border-accent aria-invalid:data-[state='open']:border-accent",
            buttonProps.disabled && 'cursor-not-allowed!',
          )}
          {...buttonProps}
        >
          <ComboboxInputBasePlaceholder
            value={value}
            valueLabel={valueLabel}
            placeholder={placeholder}
          />

          <span aria-hidden>
            <ChevronDown className="size-5 text-text duration-150 group-data-[state='open']:rotate-180" />
          </span>
        </button>
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Content
        className="z-20 mt-0.5 rounded-md border border-border bg-white p-2 shadow-lg shadow-black/10"
        style={{
          width: 'var(--radix-popover-trigger-width)',
        }}
      >
        <Command shouldFilter={!search}>
          {hasSearch && (
            <div className="relative">
              <Command.Input
                value={search}
                onValueChange={onSearchChange}
                placeholder="Rechercher..."
                className="w-full rounded-md border border-border px-4 py-2 pl-8 text-sm outline-hidden duration-150"
              />
              <span
                aria-hidden
                className="absolute top-1/2 left-2 -translate-y-1/2"
              >
                <TextSearchIcon className="size-4 text-text duration-150 group-data-[state='open']:rotate-180" />
              </span>
            </div>
          )}

          <Command.List className="mt-2 max-h-40 overflow-auto pr-1">
            <ComboboxInputBaseBody
              disabledOptions={disabledOptions}
              options={options}
              value={value}
              isLoading={isLoading}
              isErrored={isErrored}
              onSelectValue={onSelectValue}
            />
          </Command.List>
        </Command>
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Root>
  )
}

function ComboboxInputBasePlaceholder<T extends string | string[]>(
  props: Pick<
    ComboboxInputBaseProps<T>,
    'value' | 'valueLabel' | 'placeholder'
  >,
) {
  const isValueArray = Array.isArray(props.value)

  if (isValueArray) {
    const selectionCount = (props.value as Array<string>).length

    return (
      <span
        data-has-value={selectionCount > 0}
        className="inline-flex items-center gap-2 text-grey data-[has-value=true]:text-text"
      >
        {props.placeholder || 'Sélectionner'}
        {selectionCount > 0 && (
          <span className="grid size-5 place-items-center rounded-full bg-grey/20 text-xs">
            {selectionCount}
          </span>
        )}
      </span>
    )
  }

  return (
    <span
      data-has-value={!!props.value}
      className="text-grey data-[has-value=true]:text-text"
    >
      {props.valueLabel || props.placeholder || 'Sélectionner'}
    </span>
  )
}

function ComboboxInputBaseBody<T extends string | string[]>(
  props: Pick<
    ComboboxInputBaseProps<T>,
    | 'options'
    | 'value'
    | 'isLoading'
    | 'isErrored'
    | 'onSelectValue'
    | 'disabledOptions'
  >,
) {
  if (props.isErrored) {
    return (
      <Command.Empty className="grid place-items-center gap-2 pb-2 text-xs">
        Something went wrong
      </Command.Empty>
    )
  }

  if (props.isLoading) {
    return (
      <Command.Loading className="grid place-items-center">
        <div className="grid place-items-center pb-2 text-xs">
          <DotLoader size="xs" />
          Preparing results...
        </div>
      </Command.Loading>
    )
  }

  return (
    <Fragment>
      <Command.Empty className="grid place-items-center pb-2 text-xs">
        Nothing found
      </Command.Empty>

      {props.options.map((option) => {
        const isSelected = Array.isArray(props.value)
          ? (props.value as Array<string | number>).includes(option.value)
          : props.value === option.value
        const isDisabled = props.disabledOptions?.includes(option.value)
        return (
          <Command.Item
            key={option.value}
            disabled={isDisabled}
            value={option.value as string}
            data-checked={isSelected}
            onSelect={() => {
              if (isDisabled) return
              props.onSelectValue(option.value as string)
            }}
            className={cn(
              'group relative mt-0.75 rounded-md px-3 py-2 text-sm duration-75 outline-none first:mt-0 data-[checked=true]:bg-grey/20 data-[selected=true]:bg-grey/5 data-[checked=true]:data-[selected=true]:bg-grey/10',
              isDisabled && 'cursor-not-allowed opacity-30',
            )}
          >
            <span>{option.label}</span>
            <span
              aria-hidden
              className="absolute top-1/2 right-2 hidden -translate-y-1/2 group-data-[checked=true]:block"
            >
              <CheckCircle2Icon className="w-4" />
            </span>
            <div className="absolute -bottom-0.5 left-2 h-px w-[calc(100%-1rem)] bg-border group-last:hidden"></div>
          </Command.Item>
        )
      })}
    </Fragment>
  )
}
