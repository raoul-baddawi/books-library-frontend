import type { ComponentProps, FunctionComponent } from 'react'
import type { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form'

import type { FormInputCleanComponentProps, FormInputProps } from './types'

export function createAppFormField<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TComponent extends FunctionComponent<any>,
  TFieldValues extends FieldValues,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TContext = any,
  TTransformedValues = TFieldValues,
>(
  component: TComponent,
  form: UseFormReturn<TFieldValues, TContext, TTransformedValues>,
) {
  return <TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(
    props: Omit<
      FormInputProps<TFieldValues, TFieldName, TContext, TTransformedValues>,
      'form'
    > &
      FormInputCleanComponentProps<ComponentProps<TComponent>>,
  ) =>
    component({
      ...props,
      form,
    })
}
