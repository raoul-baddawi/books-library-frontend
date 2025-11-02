import { type ComponentProps, useId } from 'react'
import { Fragment } from 'react/jsx-runtime'
import type { FieldPath, FieldValues } from 'react-hook-form'

import InputError from '$/lib/components/ui/inputs/InputError'
import Label from '$/lib/components/ui/inputs/Label'
import TextAreaInput from '$/lib/components/ui/inputs/TextAreaInput'

import type { FormInputCleanComponentProps, FormInputProps } from '../types'
import { cn } from '$/lib/utils/styling'

interface FormTextAreaInputProps<
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
    FormInputCleanComponentProps<ComponentProps<typeof TextAreaInput>> {}

export default function FormTextAreaInput<
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
  ...textAreaInputProps
}: FormTextAreaInputProps<
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
      <TextAreaInput
        id={name}
        aria-invalid={fieldState.invalid}
        aria-errormessage={inputErrorVisible ? errorMessageId : undefined}
        disabled={isSubmitting}
        {...textAreaInputProps}
        {...registerReturn}
        className={cn(
          textAreaInputProps.className,
          (fieldState.invalid || inputErrorVisible) &&
            'aria-invalid:border-danger! focus:aria-invalid:border-red! border-red! border',
        )}
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
