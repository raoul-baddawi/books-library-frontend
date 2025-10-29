import { zodResolver } from '@hookform/resolvers/zod'

import useAppForm from '$/features/shared/forms/hooks/useAppForm'
import Button from '$/lib/components/ui/buttons/Button'
import useApiMutation from '$/lib/hooks/useApiMutation'

import { submittableFormSchema, SubmittableFormType } from './validations'

function SubmittableForm() {
  const { mutate, isPending } = useApiMutation({
    mutationFn: (data: SubmittableFormType) => {
      // here will be using apiClient instead, but for demo purpose, we are simulating a network request
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(data)
        }, 2000)
      })
    },
    onSuccess: (data) => {
      console.log('data on success mutation', data)
    },
    onError: (error) => {
      console.log('error in  mutation', error)
    },
  })

  const {
    handleFormSubmit,
    fields: { TextInput },
  } = useAppForm<SubmittableFormType>({
    resolver: zodResolver(submittableFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
    },
    onSubmit: (data) => {
      mutate(data)
    },
    onInvalidSubmit: (errors) => {
      console.log(errors)
    },
  })

  return (
    <form
      onSubmit={handleFormSubmit}
      className="w-full p-2 flex flex-col gap-4"
    >
      <div className="flex flex-col">
        <TextInput name="firstName" placeholder="First Name" />
      </div>
      <div className="flex flex-col">
        <TextInput name="lastName" placeholder="Last Name" />
      </div>
      <div className="flex flex-col">
        <TextInput name="email" placeholder="Email" />
      </div>
      <Button isLoading={isPending} disabled={isPending} type="submit">
        Submit
      </Button>
    </form>
  )
}
export default SubmittableForm
