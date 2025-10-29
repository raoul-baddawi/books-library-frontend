import type {
  ClipboardEvent,
  ComponentProps,
  DragEvent,
  KeyboardEvent,
  WheelEvent,
} from 'react'
import { useEffect, useId, useRef, useState } from 'react'
import { Fragment } from 'react/jsx-runtime'
import type { FieldPath, FieldValues } from 'react-hook-form'

import InputError from '$/lib/components/ui/inputs/InputError'
import Label from '$/lib/components/ui/inputs/Label'
import TextInput from '$/lib/components/ui/inputs/TextInput'

import type { FormInputCleanComponentProps, FormInputProps } from '../types'

interface FormTextInputProps<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TContext = any,
  TTransformedValues = TFieldValues,
> extends FormInputProps<
      TFieldValues,
      TFieldName,
      TContext,
      TTransformedValues
    >,
    FormInputCleanComponentProps<ComponentProps<typeof TextInput>> {
  allowNegative?: boolean
  regexPattern?: RegExp
  capitalizeAll?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export default function FormTextInput<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TContext = any,
  TTransformedValues = TFieldValues,
>({
  form,
  name,
  label,
  registerOptions,
  type = 'text',
  allowNegative = false,
  regexPattern: pattern,
  capitalizeAll = false,
  onChange: customOnChange,
  ...textInputProps
}: FormTextInputProps<TFieldValues, TFieldName, TContext, TTransformedValues>) {
  const errorMessageId = useId()
  const { formState } = form
  const { isSubmitting } = formState
  const { ref, ...registerProps } = form.register(name, {
    ...registerOptions,
    setValueAs:
      type === 'number'
        ? (v) => {
            if (v === '' || v == null) return null
            const n = Number(v)
            return isNaN(n) ? null : n
          }
        : (v) => v,
  })

  const fieldState = form.getFieldState(name, formState)
  const inputErrorVisible = fieldState.invalid && !!fieldState.error?.message

  const containsNegative = (value: string): boolean => {
    return /^-|\s-/.test(value) || value.includes('-')
  }

  const removeNegativeSigns = (value: string): string => {
    return value.replace(/-/g, '')
  }

  const applyCapitalization = (value: string): string => {
    return capitalizeAll ? value.toUpperCase() : value
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (type === 'number' && !allowNegative) {
      if (event.key === '-' || event.key === 'Minus') {
        event.preventDefault()
      }
    }

    if (pattern && event.key.length === 1) {
      const target = event.currentTarget
      const start = target.selectionStart || 0
      const end = target.selectionEnd || 0
      const currentValue = target.value
      const keyValue = applyCapitalization(event.key)
      const newValue =
        currentValue.slice(0, start) + keyValue + currentValue.slice(end)

      if (!pattern.test(newValue)) {
        event.preventDefault()
      }
    }

    if (textInputProps.onKeyDown) {
      textInputProps.onKeyDown(event)
    }
  }

  const handleWheel = (event: WheelEvent<HTMLInputElement>) => {
    if (type === 'number' && !allowNegative) {
      const target = event.currentTarget
      const currentValue = parseFloat(target.value)

      if (event.deltaY > 0 && currentValue <= 1) {
        event.preventDefault()
      }
    }

    if (textInputProps.onWheel) {
      textInputProps.onWheel(event)
    }
  }

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    if (type === 'number' && !allowNegative) {
      const pastedText = event.clipboardData.getData('text')

      if (containsNegative(pastedText)) {
        event.preventDefault()

        const cleanedText = removeNegativeSigns(pastedText)
        if (cleanedText && /^\d*\.?\d*$/.test(cleanedText)) {
          const target = event.currentTarget
          const start = target.selectionStart || 0
          const end = target.selectionEnd || 0
          const currentValue = target.value
          const finalText = applyCapitalization(cleanedText)
          const newValue =
            currentValue.slice(0, start) + finalText + currentValue.slice(end)

          form.setValue(name, newValue as TFieldValues[TFieldName])
        }
      }
    }

    if (pattern) {
      const pastedText = event.clipboardData.getData('text')
      const target = event.currentTarget
      const start = target.selectionStart || 0
      const end = target.selectionEnd || 0
      const currentValue = target.value
      const capitalizedText = applyCapitalization(pastedText)
      const newValue =
        currentValue.slice(0, start) + capitalizedText + currentValue.slice(end)

      if (!pattern.test(newValue)) {
        event.preventDefault()
      }
    }

    if (capitalizeAll && !pattern) {
      const pastedText = event.clipboardData.getData('text')
      const target = event.currentTarget
      const start = target.selectionStart || 0
      const end = target.selectionEnd || 0
      const currentValue = target.value
      const capitalizedText = applyCapitalization(pastedText)
      const newValue =
        currentValue.slice(0, start) + capitalizedText + currentValue.slice(end)

      event.preventDefault()
      form.setValue(name, newValue as TFieldValues[TFieldName])
    }

    if (textInputProps.onPaste) {
      textInputProps.onPaste(event)
    }
  }

  const handleDrop = (event: DragEvent<HTMLInputElement>) => {
    if (type === 'number' && !allowNegative) {
      const droppedText = event.dataTransfer.getData('text')

      if (containsNegative(droppedText)) {
        event.preventDefault()

        const cleanedText = removeNegativeSigns(droppedText)
        if (cleanedText && /^\d*\.?\d*$/.test(cleanedText)) {
          const finalText = applyCapitalization(cleanedText)
          form.setValue(name, finalText as TFieldValues[TFieldName])
        }
      }
    }

    if (pattern) {
      const droppedText = event.dataTransfer.getData('text')
      const target = event.currentTarget
      const currentValue = target.value
      const capitalizedText = applyCapitalization(droppedText)
      const newValue = currentValue + capitalizedText

      if (!pattern.test(newValue)) {
        event.preventDefault()
      }
    }

    if (capitalizeAll && !pattern) {
      const droppedText = event.dataTransfer.getData('text')
      const target = event.currentTarget
      const currentValue = target.value
      const capitalizedText = applyCapitalization(droppedText)
      const newValue = currentValue + capitalizedText

      event.preventDefault()
      form.setValue(name, newValue as TFieldValues[TFieldName])
    }

    if (textInputProps.onDrop) {
      textInputProps.onDrop(event)
    }
  }

  const handleInput = (event: React.FormEvent<HTMLInputElement>) => {
    if (type === 'number' && !allowNegative) {
      const target = event.currentTarget
      const value = target.value

      if (containsNegative(value)) {
        const cleanedValue = removeNegativeSigns(value)
        const finalValue = applyCapitalization(cleanedValue)
        target.value = finalValue
        form.setValue(name, finalValue as TFieldValues[TFieldName])
      }
    }

    if (pattern) {
      const target = event.currentTarget
      const value = target.value

      if (value && !pattern.test(value)) {
        const previousValue = form.getValues(name) || ''
        const finalValue = applyCapitalization(previousValue.toString())
        target.value = finalValue
        form.setValue(name, previousValue as TFieldValues[TFieldName])
      }
    }

    if (capitalizeAll && !pattern && type !== 'number') {
      const target = event.currentTarget
      const value = target.value
      const capitalizedValue = applyCapitalization(value)
      if (value !== capitalizedValue) {
        target.value = capitalizedValue
        form.setValue(name, capitalizedValue as TFieldValues[TFieldName])
      }
    }

    if (textInputProps.onInput) {
      textInputProps.onInput(event)
    }
  }

  const currentFieldValue = form.watch(name)
  const baseValue =
    textInputProps.value !== undefined
      ? textInputProps.value
      : currentFieldValue !== undefined && currentFieldValue !== null
        ? currentFieldValue
        : ''

  const controlledValue = applyCapitalization(baseValue.toString())

  const isNumber = type === 'number'
  const [displayValue, setDisplayValue] = useState(() =>
    isNumber
      ? baseValue !== null && baseValue !== undefined
        ? controlledValue
        : ''
      : controlledValue,
  )
  const isFocusedRef = useRef(false)

  useEffect(() => {
    if (!isNumber) return
    if (!isFocusedRef.current) {
      setDisplayValue(
        baseValue !== null && baseValue !== undefined ? controlledValue : '',
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlledValue, isNumber])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isNumber) {
      setDisplayValue(event.target.value)
    }
    if (registerProps.onChange) {
      registerProps.onChange(event)
    }
    if (customOnChange) {
      customOnChange(event)
    }
  }

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    isFocusedRef.current = false
    const blurHandler = (textInputProps as ComponentProps<typeof TextInput>)
      .onBlur
    if (blurHandler) blurHandler(event)
    if (isNumber && /^\d+\.$/.test(displayValue))
      setDisplayValue(displayValue.slice(0, -1))
  }

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    isFocusedRef.current = true
    const focusHandler = (textInputProps as ComponentProps<typeof TextInput>)
      .onFocus
    if (focusHandler) focusHandler(event)
  }

  const finalValue = isNumber ? displayValue : controlledValue

  return (
    <Fragment>
      {!!label && <Label htmlFor={name}>{label}</Label>}
      <TextInput
        key={`${name}-input`}
        aria-invalid={fieldState.invalid}
        aria-errormessage={inputErrorVisible ? errorMessageId : undefined}
        disabled={isSubmitting}
        type={isNumber ? 'text' : type}
        inputMode={
          isNumber
            ? 'decimal'
            : (textInputProps as ComponentProps<typeof TextInput>).inputMode
        }
        {...textInputProps}
        {...registerProps}
        value={finalValue}
        ref={ref}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onWheel={handleWheel}
        onPaste={handlePaste}
        onDrop={handleDrop}
        onInput={handleInput}
        onBlur={handleBlur}
        onFocus={handleFocus}
      />
      {inputErrorVisible && (
        <InputError
          id={errorMessageId}
          message={fieldState.error!.message as string}
        />
      )}
    </Fragment>
  )
}
