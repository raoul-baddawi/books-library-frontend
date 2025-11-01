import { Check, ChevronDown, XIcon } from 'lucide-react'
import { forwardRef, useEffect, useRef, useState } from 'react'
import { useOnClickOutside } from 'usehooks-ts'

import { cn } from '$/lib/utils/styling'

export type SelectOption = {
  label: string
  value: number | string
  isDeleted?: boolean
}

export type OptionValueType = number | string

interface ComboSelectProps {
  id?: string
  placeholder?: string
  multiple?: boolean
  autoComplete?: boolean
  className?: string
  name?: string
  options?: SelectOption[]
  autoAddOptions?: boolean
  showSelectedOptions?: boolean
  disabled?: boolean
  // Controlled component props
  value?: OptionValueType | OptionValueType[]
  onChange?: (value: OptionValueType | OptionValueType[]) => void
  onBlur?: (value: OptionValueType | OptionValueType[]) => void
  valueAsNumber?: boolean
  capitalizeAll?: boolean
  regexRule?: RegExp
  // Accessibility props
  'aria-invalid'?: boolean
  'aria-errormessage'?: string
}

const ComboSelect = forwardRef<HTMLInputElement, ComboSelectProps>(
  (
    {
      className,
      id,
      multiple = false,
      name,
      options = [],
      autoAddOptions = false,
      showSelectedOptions = false,
      placeholder = 'Type or select an option',
      autoComplete = false,
      disabled = false,
      capitalizeAll = false,
      value: controlledValue,
      regexRule,

      onChange: controlledOnChange,
      onBlur: controlledOnBlur,
      'aria-invalid': ariaInvalid,
      'aria-errormessage': ariaErrorMessage,
    },
    ref,
  ) => {
    const [internalOptions, setInternalOptions] =
      useState<SelectOption[]>(options)
    const [isOpen, setIsOpen] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const [isTyping, setIsTyping] = useState(false) // Track if user is actively typing

    const isControlled = controlledValue !== undefined
    const [internalSelectedValues, setInternalSelectedValues] = useState<
      OptionValueType[] | OptionValueType
    >(multiple ? [] : '')

    const selectedValues = isControlled
      ? controlledValue
      : internalSelectedValues

    const normalizedSelectedValues = multiple
      ? Array.isArray(selectedValues)
        ? selectedValues
        : []
      : selectedValues

    const [filteredOptions, setFilteredOptions] = useState(options)
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1)
    const dropdownRef = useRef<HTMLDivElement>(null!)
    const inputRef = useRef<HTMLInputElement>(null)
    const optionsRef = useRef<HTMLDivElement>(null)

    const handleAutoAddOption = () => {
      const newOption = {
        label: inputValue,
        value: inputValue,
      }

      setInternalOptions((prev) => [...prev, newOption])

      if (multiple) {
        const currentValues = Array.isArray(normalizedSelectedValues)
          ? normalizedSelectedValues
          : []
        const newSelected = currentValues.includes(inputValue)
          ? currentValues
          : [...currentValues, inputValue]
        updateSelectedValues(newSelected)
      } else {
        updateSelectedValues(inputValue)
      }
    }
    const handleBlur = () => {
      setIsOpen(false)
      setIsTyping(false)
      controlledOnBlur?.(
        normalizedSelectedValues as OptionValueType | OptionValueType[],
      )

      if (inputValue.trim() !== '') {
        const matchingOption = internalOptions.find(
          (opt) => opt.label.toLowerCase() === inputValue.toLowerCase(),
        )

        if (matchingOption) {
          if (multiple) {
            const currentValues = Array.isArray(normalizedSelectedValues)
              ? normalizedSelectedValues
              : []
            const newSelected = currentValues.includes(matchingOption.value)
              ? currentValues
              : [...currentValues, matchingOption.value]
            updateSelectedValues(newSelected)
          } else {
            updateSelectedValues(matchingOption.value)
          }
        } else if (autoAddOptions) {
          handleAutoAddOption()
        } else if (!multiple) {
          updateSelectedValues(0)
        }
      }

      setInputValue('')
    }

    useEffect(() => {
      setInternalOptions(options)
    }, [options])

    useOnClickOutside(dropdownRef, () => {
      if (isOpen) {
        handleBlur()
      }
    })

    useEffect(() => {
      if (inputValue.trim() !== '') {
        const filtered = internalOptions.filter((option) =>
          option.label.toLowerCase().includes(inputValue.toLowerCase()),
        )
        setFilteredOptions(filtered)
      } else {
        setFilteredOptions(internalOptions)
      }
    }, [inputValue, internalOptions])

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

    const updateSelectedValues = (
      newValue: OptionValueType | OptionValueType[],
    ) => {
      controlledOnChange?.(newValue)
      setInternalSelectedValues(newValue)
    }

    const getFormValue = (): string => {
      if (multiple && autoAddOptions) {
        const values = Array.isArray(normalizedSelectedValues)
          ? normalizedSelectedValues
          : []
        return JSON.stringify(values)
      } else if (multiple && !autoAddOptions) {
        const values = Array.isArray(normalizedSelectedValues)
          ? normalizedSelectedValues
          : []
        // Only include values that exist in the options
        const validValues = values.filter((val) =>
          internalOptions.some((opt) => opt.value === val),
        )
        return JSON.stringify(validValues)
      } else if (!multiple && autoAddOptions) {
        return String(normalizedSelectedValues || '')
      } else {
        // Only return the value if it exists in options
        const option = internalOptions.find(
          (opt) => opt.value === normalizedSelectedValues,
        )
        return String(option ? option.value : '')
      }
    }
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!autoComplete || disabled) return

      const value = e.target.value

      if (regexRule && value !== '' && !regexRule.test(value)) {
        return
      }

      setInputValue(value)
      setIsTyping(true) // User is actively typing

      // Check if the typed value matches any existing option exactly
      const exactMatch = internalOptions.find(
        (opt) => opt.label.toLowerCase() === value.toLowerCase(),
      )

      // If no exact match and not multiple, clear the selected value
      if (!multiple && !exactMatch && normalizedSelectedValues) {
        updateSelectedValues(0)
      }

      // Only update selected values if autoAddOptions is true and single select
      if (!multiple && autoAddOptions && exactMatch) {
        updateSelectedValues(exactMatch.value)
      } else if (!multiple && autoAddOptions && !exactMatch) {
        updateSelectedValues(value)
      }

      if (!isOpen && value.trim() !== '') {
        setIsOpen(true)
      }
    }

    const toggleOption = (option: SelectOption) => {
      if (disabled) return
      if (option.isDeleted) return
      if (multiple) {
        const currentValues = Array.isArray(normalizedSelectedValues)
          ? normalizedSelectedValues
          : []
        const newSelected = currentValues.includes(option.value)
          ? currentValues.filter((v) => v !== option.value)
          : [...currentValues, option.value]

        updateSelectedValues(newSelected)
      } else {
        updateSelectedValues(option.value)
        setIsOpen(false)
      }

      setInputValue('')
      setIsTyping(false) // Stop tracking typing
      inputRef.current?.focus()
    }

    const removeOption = (value: OptionValueType, e: React.MouseEvent) => {
      if (disabled) return

      e.stopPropagation()

      // Only remove from internal options if it was auto-added
      if (
        autoAddOptions &&
        typeof value === 'string' &&
        !options.some((opt) => opt.value === value)
      ) {
        setInternalOptions(internalOptions.filter((opt) => opt.value !== value))
      }

      const newSelected = !multiple
        ? ''
        : (normalizedSelectedValues as OptionValueType[]).filter(
            (v) => v !== value,
          )
      updateSelectedValues(newSelected)
    }

    const getSelectedLabels = () => {
      if (multiple) {
        const values = Array.isArray(normalizedSelectedValues)
          ? normalizedSelectedValues
          : []
        return values.map(
          (value) =>
            internalOptions.find((opt) => opt.value === value)?.label || value,
        )
      } else {
        const option = internalOptions.find(
          (opt) => opt.value === normalizedSelectedValues,
        )
        return option
          ? [option.label]
          : normalizedSelectedValues
            ? [normalizedSelectedValues]
            : []
      }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (
        (disabled || !filteredOptions || filteredOptions.length === 0) &&
        !autoAddOptions
      )
        return

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
          if (isOpen) {
            if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
              toggleOption(filteredOptions[highlightedIndex])
            } else {
              handleAutoAddOption()
              setInputValue('')
            }
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
              e.shiftKey
                ? prev === 0
                  ? filteredOptions?.length - 1
                  : prev - 1
                : prev >= filteredOptions?.length - 1
                  ? 0
                  : prev + 1,
            )
          }
          break
      }
    }

    const selectedLabels = getSelectedLabels()

    const getInputDisplayValue = () => {
      if (isTyping && inputValue) {
        return capitalizeAll ? inputValue.toUpperCase() : inputValue
      } else if (!multiple && selectedLabels?.length > 0) {
        const selected = selectedLabels[0] as string
        return selected && typeof selected === 'string'
          ? capitalizeAll
            ? selected?.toUpperCase()
            : selected
          : ''
      } else {
        return capitalizeAll ? inputValue.toUpperCase() : inputValue
      }
    }

    return (
      <div className={cn('flex min-h-10 w-full flex-col', className)}>
        <div className="relative h-full w-full" ref={dropdownRef}>
          <div
            className={cn(
              'relative flex h-full w-full items-center rounded-lg border border-border px-3 py-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/25',
              isOpen && 'border-transparent ring-2 ring-primary/25!',
              disabled && 'cursor-not-allowed bg-neutral-light/20 opacity-60',
              ariaInvalid &&
                'border-red focus-within:border-red focus-within:ring-red/25',
            )}
            onKeyDown={(e) => {
              e.stopPropagation()
            }}
            onClick={() => {
              if (!autoComplete) {
                setIsOpen(!isOpen)
              }
              if (!disabled) inputRef.current?.focus()
            }}
          >
            <span
              className={cn(
                'pointer-events-none absolute top-1/2 left-3 z-9 origin-left -translate-y-1/2 text-sm text-grey transition-all duration-200',
                (isOpen || inputValue || selectedLabels?.length > 0) &&
                  'top-0 left-3 scale-90 bg-white px-1 text-xs',
                disabled && 'opacity-60',
                isOpen && 'text-primary',
                ariaInvalid && 'text-red',
              )}
            >
              {placeholder}
            </span>
            <div className="flex flex-1 flex-wrap items-center gap-1">
              {multiple
                ? showSelectedOptions
                  ? selectedLabels.map((label, index) => {
                      const currentValues = Array.isArray(
                        normalizedSelectedValues,
                      )
                        ? normalizedSelectedValues
                        : []
                      return (
                        <span
                          key={index}
                          className="inline-flex items-center rounded border border-primary/20 bg-primary-light/60 px-2 py-1 text-xs text-primary"
                        >
                          {label}
                          {!disabled && (
                            <XIcon
                              className="ml-1 h-3 w-3 cursor-pointer hover:text-primary"
                              onClick={(e) =>
                                removeOption(currentValues[index], e)
                              }
                            />
                          )}
                        </span>
                      )
                    })
                  : selectedLabels?.length > 0 && (
                      <span className="text-sm">
                        Selected
                        {` ${selectedLabels.length} option${selectedLabels?.length > 1 ? 's' : ''}`}
                      </span>
                    )
                : null}

              {(autoComplete || !multiple) && (
                <div
                  className={cn('flex-1', !autoComplete && 'cursor-pointer')}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (!autoComplete && !disabled) setIsOpen(!isOpen)
                  }}
                >
                  <input
                    id={id}
                    ref={inputRef}
                    type="text"
                    className={cn(
                      'flex-1 bg-transparent text-sm  outline-none placeholder:text-grey ',
                      multiple && selectedLabels?.length > 0
                        ? 'w-auto '
                        : 'w-full ',
                      !autoComplete && 'leading-0 select-none',
                      disabled && 'cursor-not-allowed',
                      multiple ? 'text-grey!' : isOpen && 'text-primary!',
                    )}
                    placeholder="" // Hide native placeholder
                    value={getInputDisplayValue()}
                    onChange={handleInputChange}
                    onFocus={() => {
                      if (
                        !disabled &&
                        (multiple || autoComplete || autoAddOptions)
                      ) {
                        setTimeout(() => {
                          if (!isOpen) {
                            setIsOpen(true)
                          }
                        }, 100)
                      }
                    }}
                    onKeyDown={handleKeyDown}
                    disabled={disabled}
                    tabIndex={disabled ? -1 : 0}
                    readOnly={!autoComplete}
                    style={!autoComplete ? { cursor: 'pointer' } : undefined}
                    aria-invalid={ariaInvalid}
                    aria-errormessage={ariaErrorMessage}
                    name={name}
                  />
                </div>
              )}
            </div>
            {multiple && (selectedValues as OptionValueType[])?.length > 0 && (
              <XIcon
                className={cn('mr-2 cursor-pointer transition-opacity')}
                size={16}
                onClick={(e) => {
                  e.stopPropagation()
                  if (disabled) return
                  setInputValue('')
                  if (multiple) {
                    updateSelectedValues([])
                  } else {
                    updateSelectedValues('')
                  }
                  inputRef.current?.focus()
                }}
              />
            )}
            <ChevronDown
              className={cn(
                'cursor-pointer transition-transform',
                isOpen ? 'rotate-180 transform' : '',
                disabled && 'cursor-not-allowed opacity-50',
              )}
              size={20}
              onClick={() => {
                if (!disabled) {
                  setIsOpen(!isOpen)
                  if (!isOpen) {
                    inputRef.current?.focus()
                  }
                }
              }}
            />
          </div>

          {isOpen && !disabled && (
            <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-neutral-light bg-white shadow-lg">
              <div ref={optionsRef}>
                {filteredOptions && filteredOptions?.length > 0 ? (
                  filteredOptions.map((option, index) => {
                    const isSelected = multiple
                      ? Array.isArray(normalizedSelectedValues) &&
                        normalizedSelectedValues.includes(option.value)
                      : normalizedSelectedValues === option.value
                    const isHighlighted = index === highlightedIndex
                    return (
                      <button
                        key={option.value}
                        className={cn(
                          'flex w-full cursor-pointer items-center px-3 py-2 hover:bg-neutral-light/30',
                          isSelected && 'bg-primary-light text-primary',
                          isHighlighted && 'bg-neutral-light/50',
                          option.isDeleted && 'cursor-not-allowed!',
                        )}
                        disabled={option.isDeleted}
                        onClick={() => {
                          toggleOption(option)
                        }}
                        onMouseEnter={() => setHighlightedIndex(index)}
                      >
                        {multiple && (
                          <div
                            className={cn(
                              'mr-2 flex h-4 w-4 items-center justify-center rounded border',
                              isSelected
                                ? 'border-primary bg-primary'
                                : 'border-gray-300',
                            )}
                          >
                            {isSelected && (
                              <Check className="h-3 w-3 text-white" />
                            )}
                          </div>
                        )}
                        <p
                          className={cn(
                            'flex w-full justify-between text-sm text-accent',
                            option.isDeleted && 'text-neutral-medium',
                          )}
                        >
                          {option.label}
                          {option.isDeleted && (
                            <span className="flex scale-80 transform items-center justify-center rounded-2xl border border-red bg-red-light p-0.5 px-2 text-[12px] font-semibold text-red">
                              Supprimé
                            </span>
                          )}
                        </p>
                      </button>
                    )
                  })
                ) : (
                  <div className="text-gray-500 px-3 py-2 text-sm">
                    No options found.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <input
          ref={ref}
          type="hidden"
          value={getFormValue()}
          onChange={() => {}}
          name={name}
        />
      </div>
    )
  },
)

ComboSelect.displayName = 'ComboSelect'

export default ComboSelect
