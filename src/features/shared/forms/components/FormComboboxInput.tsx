import { type FunctionComponent, useId } from 'react'
import { Fragment } from 'react/jsx-runtime'
import type { FieldPath, FieldValues, Path, PathValue } from 'react-hook-form'

import ComboboxInput, {
  type ComboboxInputProps,
} from '$/lib/components/ui/inputs/ComboboxInput'
import InputError from '$/lib/components/ui/inputs/InputError'
import Label from '$/lib/components/ui/inputs/Label'

import type { FormInputCleanComponentProps, FormInputProps } from '../types'

interface FormComboboxInputProps<
  TValue extends string | string[],
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
    FormInputCleanComponentProps<ComboboxInputProps<TValue>> {}

interface FormComboboxBaseInputProps<
  TValue extends string | string[],
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TContext = any,
  TTransformedValues = TFieldValues,
> extends FormComboboxInputProps<
    TValue,
    TFieldValues,
    TFieldName,
    TContext,
    TTransformedValues
  > {
  value?: TValue
  defaultValue?: TValue
  onSelectValue: (value: string) => void
  comboboxComponent: FunctionComponent<ComboboxInputProps<TValue>>
}

export default function FormComboboxInput<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TContext = any,
  TTransformedValues = TFieldValues,
>(
  props: FormComboboxInputProps<
    string,
    TFieldValues,
    TFieldName,
    TContext,
    TTransformedValues
  >,
) {
  return <SingleValueFormComboboxInput {...props} />
}

FormComboboxInput.Multi = function <
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TContext = any,
  TTransformedValues = TFieldValues,
>(
  props: FormComboboxInputProps<
    string[],
    TFieldValues,
    TFieldName,
    TContext,
    TTransformedValues
  >,
) {
  return <MultiValueFormComboboxInput {...props} />
}

function SingleValueFormComboboxInput<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TContext = any,
  TTransformedValues = TFieldValues,
>(
  props: FormComboboxInputProps<
    string,
    TFieldValues,
    TFieldName,
    TContext,
    TTransformedValues
  >,
) {
  const handleSelectValue = (value: string) => {
    props.form.setValue(
      props.name,
      value as PathValue<TFieldValues, Path<TFieldValues>>,
      {
        shouldDirty: true,
        shouldValidate: props.form.formState.isSubmitted,
      },
    )
    props.onSelectValue?.(value)
  }

  const value = props.form.watch(props.name) as string | undefined

  return (
    <FormComboboxBaseInput
      {...props}
      comboboxComponent={ComboboxInput}
      value={value}
      onSelectValue={handleSelectValue}
    />
  )
}

function MultiValueFormComboboxInput<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TContext = any,
  TTransformedValues = TFieldValues,
>(
  props: FormComboboxInputProps<
    string[],
    TFieldValues,
    TFieldName,
    TContext,
    TTransformedValues
  >,
) {
  const handleSelectValue = (value: string) => {
    const currentValues = props.form.getValues(props.name) as
      | string[]
      | undefined
    let newValues: string[] = []

    if (!currentValues) {
      newValues = [value]
    } else {
      if (currentValues.includes(value)) {
        newValues = currentValues.filter((o) => o !== value)
      } else {
        newValues = [...currentValues, value]
      }
    }

    props.form.setValue(
      props.name,
      newValues as PathValue<TFieldValues, Path<TFieldValues>>,
      {
        shouldDirty: true,
        shouldValidate: props.form.formState.isSubmitted,
      },
    )
    props.onSelectValue?.(value)
  }

  const value = props.form.watch(props.name) as string[] | undefined

  return (
    <FormComboboxBaseInput
      {...props}
      comboboxComponent={ComboboxInput.Multi}
      value={value}
      defaultValue={[]}
      onSelectValue={handleSelectValue}
    />
  )
}

function FormComboboxBaseInput<
  TValue extends string | string[],
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TContext = any,
  TTransformedValues = TFieldValues,
>({
  comboboxComponent: ComboboxComponent,
  value,
  defaultValue,
  form,
  name,
  label,
  registerOptions,
  onSelectValue,
  ...comboboxInputProps
}: FormComboboxBaseInputProps<
  TValue,
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
      <ComboboxComponent
        aria-invalid={fieldState.invalid}
        aria-errormessage={inputErrorVisible ? errorMessageId : undefined}
        {...comboboxInputProps}
        name={registerReturn.name}
        ref={registerReturn.ref}
        disabled={
          comboboxInputProps.disabled || registerReturn.disabled || isSubmitting
        }
        onBlur={registerReturn.onBlur}
        value={value}
        defaultValue={defaultValue}
        onSelectValue={onSelectValue}
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
