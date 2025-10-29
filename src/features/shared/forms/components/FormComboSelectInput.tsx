import { type ComponentProps, useEffect, useId, useState } from 'react'
import { Fragment } from 'react/jsx-runtime'
import type { FieldPath, FieldValues, PathValue } from 'react-hook-form'

import ComboSelect, {
  type OptionValueType,
} from '$/lib/components/ui/inputs/ComboSelectInput'
import InputError from '$/lib/components/ui/inputs/InputError'
import Label from '$/lib/components/ui/inputs/Label'

import type { FormInputCleanComponentProps, FormInputProps } from '../types'

interface FormComboSelectProps<
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
    FormInputCleanComponentProps<ComponentProps<typeof ComboSelect>> {
  onSelect?: (value: OptionValueType | OptionValueType[]) => void
}

export default function FormComboSelect<
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
  multiple = false,
  options = [],
  valueAsNumber = false,
  onSelect,
  ...comboSelectProps
}: FormComboSelectProps<
  TFieldValues,
  TFieldName,
  TContext,
  TTransformedValues
>) {
  const errorMessageId = useId()
  const { formState, clearErrors } = form
  const { isSubmitting } = formState
  const [hasSelectedValue, setHasSelectedValue] = useState(false)

  const { ref, ...registerProps } = form.register(name, {
    ...registerOptions,
    setValueAs: (value) => {
      if (value === '' || value === null) {
        return valueAsNumber ? (multiple ? [] : 0) : undefined
      }

      if (multiple) {
        try {
          const parsedValue =
            typeof value === 'string' ? JSON.parse(value) : value
          const arrayValue = Array.isArray(parsedValue) ? parsedValue : []

          if (arrayValue.length === 0) {
            if (valueAsNumber) {
              return []
            }
            return undefined
          }

          if (valueAsNumber) {
            return arrayValue.map((v) => {
              const num = Number(v)
              return isNaN(num) ? v : num
            })
          }

          return arrayValue
        } catch {
          return valueAsNumber ? (multiple ? [] : 0) : undefined
        }
      } else {
        if (valueAsNumber) {
          const num = Number(value)
          return isNaN(num) ? undefined : num
        }

        return value
      }
    },
  })

  const fieldState = form.getFieldState(name, formState)
  const inputErrorVisible = fieldState.invalid && !!fieldState.error?.message

  // Get the current form value for controlled behavior
  const currentValue = form.watch(name)

  useEffect(() => {
    setHasSelectedValue(
      currentValue !== undefined &&
        currentValue !== null &&
        currentValue !== '' &&
        currentValue !== 0,
    )
  }, [currentValue])

  return (
    <Fragment>
      {!!label && <Label htmlFor={name}>{label}</Label>}
      <ComboSelect
        key={`${name}-combo-select`}
        aria-invalid={fieldState.invalid}
        aria-errormessage={inputErrorVisible ? errorMessageId : undefined}
        disabled={isSubmitting}
        multiple={multiple}
        options={options}
        value={currentValue}
        valueAsNumber={valueAsNumber}
        {...comboSelectProps}
        {...registerProps}
        ref={ref}
        onChange={(value, ...args) => {
          clearErrors(name)
          if (registerProps.onChange) {
            registerProps.onChange({ target: { value } }, ...args)
          }
          form.setValue(name, value as PathValue<TFieldValues, TFieldName>, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
          })
          onSelect?.(value)
        }}
        onBlur={() => {
          clearErrors(name)
          form.trigger(name)
        }}
      />
      {inputErrorVisible && !hasSelectedValue && (
        <InputError
          id={errorMessageId}
          message={fieldState.error!.message as string}
        />
      )}
    </Fragment>
  )
}
