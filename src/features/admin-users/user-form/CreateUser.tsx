import ManageUserForm from './ManageUserForm'
import useApiMutation from '$/lib/hooks/useApiMutation'
import { UserFormType } from './validations'
import { apiClient } from '$/lib/utils/apiClient'
import { useRouter } from '@tanstack/react-router'

function CreateUser() {
  const router = useRouter()

  const { mutateAsync, isPending } = useApiMutation({
    mutationFn: (data: UserFormType) => {
      return apiClient.post('users', {
        json: data,
      })
    },
    mutationKey: ['create-user'],
  })
  return (
    <ManageUserForm
      isPending={isPending}
      onSubmit={(data) =>
        mutateAsync(data).then(() => {
          router.history.back()
        })
      }
    />
  )
}

export default CreateUser
