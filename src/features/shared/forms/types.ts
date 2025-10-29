import type {
  FieldPath,
  FieldValues,
  RegisterOptions,
  UseFormRegisterReturn,
  UseFormReturn,
} from 'react-hook-form'

export type FormInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TContext = any,
  TTransformedValues = TFieldValues,
> = {
  form: UseFormReturn<TFieldValues, TContext, TTransformedValues>
  name: TFieldName
  label?: string
  registerOptions?: RegisterOptions<TFieldValues, TFieldName>
}

export type ManagedInputProps = {
  'aria-invalid'?: boolean
  'aria-errormessage'?: string
}

export type FormInputCleanComponentProps<T> = Omit<
  T,
  | keyof FormInputProps
  | Exclude<keyof UseFormRegisterReturn, 'disabled' | 'onChange'>
  | keyof ManagedInputProps
>
