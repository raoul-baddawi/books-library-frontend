import { UserFormType } from './validations'
import useApiMutation from '$/lib/hooks/useApiMutation'
import { apiClient } from '$/lib/utils/apiClient'
import ManageUserForm from './ManageUserForm'
import { useRouter } from '@tanstack/react-router'
import PageLoader from '$/lib/components/loaders/PgaeLoader'

type EditUserProps = {
  data?: UserFormType
  id: number
}
function EditUser({ data, id }: EditUserProps) {
  const router = useRouter()
  const { mutateAsync, isPending } = useApiMutation({
    mutationFn: ({ password, ...rest }: UserFormType) => {
      return apiClient.patch(`users/${id}`, {
        json: {
          ...rest,
          ...(password ? { password } : {}),
        },
      })
    },
    mutationKey: ['edit-user'],
  })

  if (!data) return <PageLoader />

  return (
    <ManageUserForm
      key={JSON.stringify(data)}
      isPending={isPending}
      onSubmit={(data) =>
        mutateAsync(data).then(() => {
          router.history.back()
        })
      }
      defaultValues={data}
      isEditMode
      onInvalidSubmit={(errors) => console.log(errors)}
    />
  )
}

export default EditUser
