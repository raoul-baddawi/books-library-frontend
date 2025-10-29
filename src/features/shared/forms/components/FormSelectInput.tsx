import { type ComponentProps, useCallback, useId } from 'react'
import { Fragment } from 'react/jsx-runtime'
import type { FieldPath, FieldValues, PathValue } from 'react-hook-form'

import InputError from '$/lib/components/ui/inputs/InputError'
import Label from '$/lib/components/ui/inputs/Label'
import SelectInput from '$/lib/components/ui/inputs/SelectInput'

import type { FormInputCleanComponentProps, FormInputProps } from '../types'

interface FormSelectInputProps<
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
    FormInputCleanComponentProps<ComponentProps<typeof SelectInput>> {}

export default function FormSelectInput<
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
  onValueChange,
  ...selectInputProps
}: FormSelectInputProps<
  TFieldValues,
  TFieldName,
  TContext,
  TTransformedValues
>) {
  const errorMessageId = useId()
  const { isSubmitting, errors: _errorsSubscriber } = form.formState
  const registerReturn = form.register(name, registerOptions)
  const fieldState = form.getFieldState(name)
  const inputErrorVisible = fieldState.invalid && !!fieldState.error?.message

  const handleValueChange = useCallback(
    (value: string) => {
      if (value) {
        form.clearErrors(name)
      }

      form.setValue(name, value as PathValue<TFieldValues, TFieldName>, {
        shouldDirty: true,
      })

      onValueChange?.(value)
    },
    [name, form, onValueChange],
  )

  return (
    <Fragment>
      {!!label && <Label htmlFor={name}>{label}</Label>}
      <SelectInput
        aria-invalid={fieldState.invalid}
        aria-errormessage={inputErrorVisible ? errorMessageId : undefined}
        {...selectInputProps}
        name={registerReturn.name}
        ref={registerReturn.ref}
        disabled={
          selectInputProps.disabled || registerReturn.disabled || isSubmitting
        }
        onBlur={registerReturn.onBlur}
        onValueChange={handleValueChange}
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
