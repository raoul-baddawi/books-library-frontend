import { type ComponentProps, Fragment, useId } from 'react'
import type { FieldPath, FieldValues } from 'react-hook-form'

import InputError from '$/lib/components/ui/inputs/InputError'
import Label from '$/lib/components/ui/inputs/Label'
import PasswordInput from '$/lib/components/ui/inputs/PasswordInput'

import type { FormInputCleanComponentProps, FormInputProps } from '../types'

interface FormPasswordInputProps<
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
    FormInputCleanComponentProps<ComponentProps<typeof PasswordInput>> {}

export default function FormPasswordInput<
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
  className,
  ...passwordInputProps
}: FormPasswordInputProps<
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

  return (
    <Fragment>
      {!!label && <Label htmlFor={name}>{label}</Label>}
      <PasswordInput
        className={className}
        isInvalid={fieldState.invalid}
        errorMessageId={inputErrorVisible ? errorMessageId : undefined}
        disabled={isSubmitting}
        {...passwordInputProps}
        {...registerReturn}
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
