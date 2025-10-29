import type { ReactNode } from 'react'
import type {
  DeepPartial,
  FieldPath,
  FieldPathValue,
  FieldPathValues,
  FieldValues,
  UseFormWatch,
} from 'react-hook-form'

// For when no field is specified - returns entire form values
type WatchPropsNoField<TFieldValues extends FieldValues = FieldValues> = {
  watch: UseFormWatch<TFieldValues>
  field?: never
  defaultValue?: never
  children: (value: TFieldValues) => ReactNode
}

// For when a single field is specified
type WatchPropsField<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
> = {
  watch: UseFormWatch<TFieldValues>
  field: TFieldName
  defaultValue?: FieldPathValue<TFieldValues, TFieldName>
  children: (value: FieldPathValue<TFieldValues, TFieldName>) => ReactNode
}

// For when an array of fields is specified
type WatchPropsFieldsArray<
  TFieldValues extends FieldValues,
  TFieldNames extends readonly FieldPath<TFieldValues>[],
> = {
  watch: UseFormWatch<TFieldValues>
  field: readonly [...TFieldNames]
  defaultValue?: DeepPartial<TFieldValues>
  children: (value: FieldPathValues<TFieldValues, TFieldNames>) => ReactNode
}

// Union type to handle all cases
type WatchProps<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends
    | FieldPath<TFieldValues>
    | readonly FieldPath<TFieldValues>[] = FieldPath<TFieldValues>,
> =
  | WatchPropsNoField<TFieldValues>
  | WatchPropsField<TFieldValues, Extract<TFieldName, FieldPath<TFieldValues>>>
  | WatchPropsFieldsArray<
      TFieldValues,
      Extract<TFieldName, readonly FieldPath<TFieldValues>[]>
    >

// Implementation for no field - returns entire form values
export default function Watch<TFieldValues extends FieldValues = FieldValues>({
  watch,
  children,
}: WatchPropsNoField<TFieldValues>): ReactNode

// Implementation for single field - returns that field's value
export default function Watch<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
>({
  watch,
  field,
  defaultValue,
  children,
}: WatchPropsField<TFieldValues, TFieldName>): ReactNode

// Implementation for array of fields - returns array of values
export default function Watch<
  TFieldValues extends FieldValues,
  TFieldNames extends readonly FieldPath<TFieldValues>[],
>({
  watch,
  field,
  defaultValue,
  children,
}: WatchPropsFieldsArray<TFieldValues, TFieldNames>): ReactNode

// Actual implementation
export default function Watch<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends
    | FieldPath<TFieldValues>
    | readonly FieldPath<TFieldValues>[] = FieldPath<TFieldValues>,
>({
  watch,
  field,
  defaultValue,
  children,
}: WatchProps<TFieldValues, TFieldName>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let watchResult: any

  if (field === undefined) {
    watchResult = watch()
  } else if (Array.isArray(field)) {
    watchResult = watch(
      field as readonly [...FieldPath<TFieldValues>[]],
      defaultValue as DeepPartial<TFieldValues>,
    )
  } else {
    watchResult = watch(
      field as FieldPath<TFieldValues>,
      defaultValue as FieldPathValue<TFieldValues, FieldPath<TFieldValues>>,
    )
  }

  return children(watchResult)
}
