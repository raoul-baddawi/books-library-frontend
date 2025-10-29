import type { ComponentProps, FunctionComponent, JSX } from 'react'
import { useId } from 'react'
import { Fragment } from 'react/jsx-runtime'
import type {
  FieldPath,
  FieldValues,
  UseFormRegisterReturn,
  UseFormReturn,
} from 'react-hook-form'

import InputError from '$/lib/components/ui/inputs/InputError'
import Label from '$/lib/components/ui/inputs/Label'

import type { FormInputCleanComponentProps, FormInputProps } from '../types'

type Props<
  TComponent extends FunctionComponent,
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
> = FormInputProps<TFieldValues, TFieldName> &
  FormInputCleanComponentProps<ComponentProps<TComponent>> & {
    children: (props: {
      registerReturn: UseFormRegisterReturn<TFieldName>
      fieldState: ReturnType<UseFormReturn<TFieldValues>['getFieldState']>
      componentProps: Omit<
        Props<TComponent, TFieldValues, TFieldName>,
        'form' | 'name' | 'label' | 'registerOptions' | 'children'
      >
    }) => JSX.Element
  }

/**
 * This component can be used to build any form input component.
 *
 * @deprecated This is meant to be used as an experimental component. It is not recommended to use at this time.
 *
 * @example
 * ```tsx
 * import { ComponentProps } from "react";
 * import { FieldValues, FieldPath } from "react-hook-form";
 * import TextInput from "~ui/inputs/TextInput";
 * import BaseFormInput from "./BaseFormInput";
 *
 * function FormTextInput<
 *   TFieldValues extends FieldValues = FieldValues,
 *   TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
 * >(
 *  props: Omit<
 *    ComponentProps<
 *       typeof BaseFormInput<typeof TextInput, TFieldValues, TFieldName>
 *     >,
 *     "children"
 *    >,
 * ) {
 *  return (
 *    <BaseFormInput {...props}>
 *      {({ registerReturn, fieldState, componentProps }) => (
 *        <TextInput
 *          aria-invalid={fieldState.invalid}
 *          aria-errormessage={fieldState.invalid ? props.id : undefined}
 *          {...registerReturn}
 *          {...componentProps}
 *        />
 *      )}
 *    </BaseFormInput>
 *  );
 *}
 * ```
 */
export default function BaseFormInput<
  TComponent extends FunctionComponent,
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  form,
  name,
  label,
  registerOptions,
  children,
  ...componentProps
}: Props<TComponent, TFieldValues, TFieldName>) {
  const errorMessageId = useId()
  const { errors: _errorsSubscriber } = form.formState
  const registerReturn = form.register(name, registerOptions)
  const fieldState = form.getFieldState(name)
  const inputErrorVisible = fieldState.invalid && !!fieldState.error?.message

  return (
    <Fragment>
      {!!label && <Label htmlFor={name}>{label}</Label>}
      {children({
        registerReturn,
        fieldState,
        componentProps: componentProps,
      })}

      {inputErrorVisible && (
        <InputError
          id={errorMessageId}
          message={fieldState.error!.message as string}
        />
      )}
    </Fragment>
  )
}
