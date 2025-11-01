import { Check, ChevronDown, XIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useOnClickOutside } from 'usehooks-ts'

import { cn } from '$/lib/utils/styling'

import { useEnhancedTable } from './EnhancedTableProvider'

type EnhancedTableComboSelectProps = {
  placeHolder?: string
  multiple?: boolean
  autoComplete?: boolean
  className?: string
  name: string
  initialOptions?: SelectOption[]
  autoAddOptions?: boolean
  showSelectedOptions?: boolean
}

export type SelectOption = {
  label: string
  value: number | string
  isDeleted?: boolean
}

type OptionValueType = number | string

type FilterValueType = string | string[] | number[] | number

export default function EnhancedTableComboSelect({
  className,
  multiple,
  name,
  initialOptions,
  autoAddOptions = false,
  showSelectedOptions = false,
  placeHolder = 'Type or select an option',
  autoComplete,
}: EnhancedTableComboSelectProps) {
  const { handleSetFilters } = useEnhancedTable<
    unknown,
    unknown,
    { [key: string]: Partial<FilterValueType> }
  >()
  const [options, setOptions] = useState<SelectOption[]>(initialOptions ?? [])
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [selectedValues, setSelectedValues] = useState<
    OptionValueType[] | OptionValueType | undefined
  >(undefined)
  const [filteredOptions, setFilteredOptions] = useState(initialOptions)
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1)
  const dropdownRef = useRef<HTMLDivElement>(null!)
  const inputRef = useRef<HTMLInputElement>(null)
  const optionsRef = useRef<HTMLDivElement>(null)

  useOnClickOutside(dropdownRef, () => {
    handleBlur()
  })

  useEffect(() => {
    if (inputValue.trim() !== '') {
      const filtered = options.filter((option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase()),
      )
      setFilteredOptions(filtered)
    } else {
      setFilteredOptions(options)
    }
  }, [inputValue, options])

  useEffect(() => {
    setHighlightedIndex(isOpen ? 0 : -1)
  }, [isOpen, filteredOptions])

  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && optionsRef.current) {
      const highlightedElement = optionsRef.current.children[
        highlightedIndex
      ] as HTMLElement
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth',
        })
      }
    }
  }, [highlightedIndex, isOpen])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!autoComplete) return

    const value = e.target.value
    setInputValue(value)

    if (!multiple) {
      setSelectedValues(value)
    }
    if (!isOpen && value.trim() !== '') {
      setIsOpen(true)
    }
  }

  const handleBlur = () => {
    setIsOpen(false)

    if (inputValue.trim() !== '') {
      const matchingOption = options.find(
        (opt) => opt.label.toLowerCase() === inputValue.toLowerCase(),
      )

      if (matchingOption) {
        if (multiple) {
          const newSelected = Array.isArray(selectedValues)
            ? selectedValues.includes(matchingOption.value)
              ? selectedValues
              : [...selectedValues, matchingOption.value]
            : [matchingOption.value]
          setSelectedValues(newSelected)
        } else {
          setSelectedValues(matchingOption.value)
        }
      } else if (autoAddOptions) {
        const newOption = {
          label: inputValue,
          value: inputValue,
        }

        setOptions((prev) => [...prev, newOption])

        if (multiple) {
          const newSelected = Array.isArray(selectedValues)
            ? selectedValues.includes(inputValue)
              ? selectedValues
              : [...selectedValues, inputValue]
            : [inputValue]
          setSelectedValues(newSelected)
        } else {
          setSelectedValues(inputValue)
        }
      }
    }

    setInputValue('')
  }

  const toggleOption = (option: SelectOption) => {
    if (multiple) {
      const newSelected = Array.isArray(selectedValues)
        ? selectedValues.includes(option.value)
          ? selectedValues.filter((v) => v !== option.value)
          : [...selectedValues, option.value]
        : [option.value]

      setSelectedValues(newSelected)
    } else {
      setSelectedValues(option.value)
      setIsOpen(false)
    }

    setInputValue('')
    inputRef.current?.focus()
  }

  const removeOption = (value: OptionValueType, e: React.MouseEvent) => {
    e.stopPropagation()

    if (
      typeof value === 'string' &&
      !initialOptions?.some((opt) => opt.value === value)
    ) {
      setOptions(options.filter((opt) => opt.value !== value))
    }

    const newSelected = !multiple
      ? undefined
      : ((selectedValues || []) as OptionValueType[]).filter((v) => v !== value)

    setSelectedValues(newSelected)
  }

  const getSelectedLabels = () => {
    if (multiple) {
      return ((selectedValues || []) as OptionValueType[]).map(
        (value) => options.find((opt) => opt.value === value)?.label || value,
      )
    } else {
      const option = options.find((opt) => opt.value === selectedValues)
      return option ? [option.label] : selectedValues ? [selectedValues] : []
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!filteredOptions || filteredOptions?.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
        } else {
          setHighlightedIndex((prev) =>
            prev < filteredOptions?.length - 1 ? prev + 1 : 0,
          )
        }
        break
      case 'ArrowUp':
        e.preventDefault()
        if (isOpen) {
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredOptions?.length - 1,
          )
        }
        break
      case 'Enter':
        e.preventDefault()
        if (
          isOpen &&
          highlightedIndex >= 0 &&
          filteredOptions[highlightedIndex]
        ) {
          toggleOption(filteredOptions[highlightedIndex])
        } else if (!isOpen) {
          setIsOpen(true)
        }
        break
      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        inputRef.current?.blur()
        break
      case 'Tab':
        if (isOpen) {
          e.preventDefault()
          setHighlightedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : 0,
          )
        }
        break
    }
  }

  const selectedLabels = getSelectedLabels()

  useEffect(() => {
    const isMatchingValues = options.some((opt) => {
      if (typeof opt.value === 'number') {
        return selectedValues === opt.label
      } else return (opt.value as string).includes(selectedValues as string)
    })
    if (autoComplete && !multiple) {
      if (isMatchingValues)
        handleSetFilters(name, selectedValues as FilterValueType)
    } else {
      handleSetFilters(name, selectedValues as FilterValueType)
    }
    // Only want to run this effect when selectedValues changes, not any other state
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedValues])

  return (
    <div
      className={cn(
        'flex h-11 w-full grow flex-col sm:max-w-64 sm:min-w-60 sm:grow-0',
        className,
      )}
    >
      <div className="relative h-full" ref={dropdownRef}>
        <div
          className={cn(
            'flex h-full w-full items-center rounded-md border border-neutral-light px-3 py-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/25',
            isOpen && 'border-transparent ring-2 ring-primary/25!',
          )}
          onClick={() => {
            if (!autoComplete) {
              setIsOpen(!isOpen)
            }
            inputRef.current?.focus()
          }}
        >
          <div className="flex flex-1 flex-wrap gap-1">
            {showSelectedOptions &&
              multiple &&
              selectedLabels.map((label, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded border border-primary/20 bg-primary-light/60 px-2 py-1 text-xs text-primary"
                >
                  {label}
                  <XIcon
                    className="ml-1 h-3 w-3 cursor-pointer hover:text-primary"
                    onClick={(e) =>
                      removeOption(
                        Array.isArray(selectedValues)
                          ? selectedValues[index]
                          : '',
                        e,
                      )
                    }
                  />
                </span>
              ))}

            <div
              className={cn('flex-1', !autoComplete && 'cursor-pointer')}
              onClick={() => {
                if (!autoComplete) setIsOpen(!isOpen)
              }}
            >
              <input
                ref={inputRef}
                type="text"
                className={cn(
                  'flex-1 bg-transparent text-sm text-accent outline-none',
                  multiple && selectedLabels.length > 0
                    ? 'w-auto placeholder:text-accent'
                    : 'w-full',
                  !autoComplete && 'leading-0 select-none',
                )}
                placeholder={
                  selectedLabels.length === 0
                    ? placeHolder
                    : `Selected ${selectedLabels.length}`
                }
                value={
                  !multiple
                    ? ((selectedLabels[0] as string) ?? inputValue)
                    : inputValue
                }
                onChange={handleInputChange}
                onFocus={() => {
                  if (multiple || autoComplete || autoAddOptions) {
                    if (!isOpen) {
                      setIsOpen(true)
                    }
                  }
                }}
                onKeyDown={handleKeyDown}
                disabled={false}
                tabIndex={0}
                readOnly={!autoComplete}
                style={!autoComplete ? { cursor: 'pointer' } : undefined}
              />
            </div>
          </div>

          <ChevronDown
            className={cn(
              'text-gray-400 cursor-pointer transition-transform',
              isOpen ? 'rotate-180 transform' : '',
            )}
            size={16}
            onClick={() => {
              setIsOpen(!isOpen)
              if (!isOpen) {
                inputRef.current?.focus()
              }
            }}
          />
        </div>

        {isOpen && (
          <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-neutral-light bg-white shadow-lg">
            <div ref={optionsRef}>
              {filteredOptions && filteredOptions?.length > 0 ? (
                filteredOptions?.map((option, index) => {
                  const isSelected = multiple
                    ? Array.isArray(selectedValues) &&
                      selectedValues.includes(option.value)
                    : selectedValues === option.value
                  const isHighlighted = index === highlightedIndex

                  return (
                    <div
                      key={option.value}
                      className={cn(
                        'flex cursor-pointer items-center px-3 py-2 hover:bg-neutral-light/30',
                        isSelected && 'bg-primary-light text-primary',
                        isHighlighted && 'bg-neutral-light/50',
                      )}
                      onClick={() => toggleOption(option)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                    >
                      {multiple && (
                        <div
                          className={cn(
                            'mr-2 flex h-4 w-4 items-center justify-center rounded border',
                            isSelected
                              ? 'border-primary bg-primary'
                              : 'border-',
                          )}
                        >
                          {isSelected && (
                            <Check className="h-3 w-3 text-white" />
                          )}
                        </div>
                      )}
                      <span className="text-gray-700 text-sm">
                        {option.label}
                      </span>
                    </div>
                  )
                })
              ) : (
                <div className="text-gray-500 px-3 py-2 text-sm">
                  Pas d'options trouvées.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
