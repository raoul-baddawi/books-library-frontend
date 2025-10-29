import type {
  FormEventHandler,
  FunctionComponent,
  PropsWithChildren,
  ReactNode,
} from 'react'
import { useMemo } from 'react'
import type {
  DeepPartial,
  FieldPath,
  FieldPathValue,
  FieldPathValues,
  FieldValues,
  SubmitErrorHandler,
  SubmitHandler,
  UseFormProps,
} from 'react-hook-form'
import { FormProvider, useForm } from 'react-hook-form'

import FormComboboxInput from '../components/FormComboboxInput'
import FormComboSelect from '../components/FormComboSelectInput'
import FormMediaInput from '../components/FormMediaInput'
import FormPasswordInput from '../components/FormPasswordInput'
import FormSelectInput from '../components/FormSelectInput'
import FormTextAreaInput from '../components/FormTextAreaInput'
import FormTextInput from '../components/FormTextInput'
import Watch from '../components/Watch'
import { createAppFormField } from '../utils'

export interface UseAppFormProps<
  TFieldValues extends FieldValues = FieldValues,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TContext = any,
  TTransformedValues = TFieldValues,
> extends UseFormProps<TFieldValues, TContext, TTransformedValues> {
  onSubmit?: SubmitHandler<TTransformedValues>
  onInvalidSubmit?: SubmitErrorHandler<TFieldValues>
}

export default function useAppForm<
  TFieldValues extends FieldValues = FieldValues,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TContext = any,
  TTransformedValues = TFieldValues,
>(props?: UseAppFormProps<TFieldValues, TContext, TTransformedValues>) {
  const formApi = useForm<TFieldValues, TContext, TTransformedValues>(props)

  const components = useMemo(() => {
    const Provider = ({ children }: PropsWithChildren) =>
      FormProvider<TFieldValues, TContext, TTransformedValues>({
        ...formApi,
        children,
      })

    function InternalWatch(props: {
      children: (value: TFieldValues) => ReactNode
    }): ReactNode
    function InternalWatch<TFieldName extends FieldPath<TFieldValues>>(props: {
      field: TFieldName
      defaultValue?: FieldPathValue<TFieldValues, TFieldName>
      children: (value: FieldPathValue<TFieldValues, TFieldName>) => ReactNode
    }): ReactNode
    function InternalWatch<
      TFieldNames extends readonly FieldPath<TFieldValues>[],
    >(props: {
      field: readonly [...TFieldNames]
      defaultValue?: DeepPartial<TFieldValues>
      children: (value: FieldPathValues<TFieldValues, TFieldNames>) => ReactNode
    }): ReactNode
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function InternalWatch(props: any): ReactNode {
      return Watch({
        watch: formApi.watch,
        ...props,
      })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const createField = <TComponent extends FunctionComponent<any>>(
      component: TComponent,
    ) => {
      return createAppFormField<
        TComponent,
        TFieldValues,
        TContext,
        TTransformedValues
      >(component, formApi)
    }

    return {
      Provider,
      Watch: InternalWatch,
      fields: {
        PasswordInput: createField(FormPasswordInput),
        TextInput: createField(FormTextInput),
        TextAreaInput: createField(FormTextAreaInput),
        SelectInput: createField(FormSelectInput),
        ComboboxInput: createField(FormComboboxInput),
        MultiComboboxInput: createField(FormComboboxInput.Multi),
        MediaInput: createField(FormMediaInput),
        ComboSelectInput: createField(FormComboSelect),
      },
    }
  }, [formApi])

  const handleFormSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    return formApi.handleSubmit(
      props?.onSubmit ?? (() => {}),
      props?.onInvalidSubmit,
    )(e)
  }

  return {
    formApi,
    ...components,
    handleFormSubmit,
  }
}
