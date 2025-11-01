import { BookFormType } from './validations'
import useApiMutation from '$/lib/hooks/useApiMutation'
import { apiClient } from '$/lib/utils/apiClient'
import { useRouter } from '@tanstack/react-router'
import PageLoader from '$/lib/components/loaders/PgaeLoader'
import ManageBookForm from './ManageBookForm'
import {
  useGenreOptions,
  useAuthorsOptions,
} from '$/lib/api-hooks/api-select-options'

type EditBookProps = {
  data?: BookFormType
  id: number
}
function EditBook({ data, id }: EditBookProps) {
  const router = useRouter()
  const { data: genreOptions, isPending: isGenrePending } = useGenreOptions()
  const { data: authorsOptions, isPending: isAuthorsPending } =
    useAuthorsOptions()
  const { mutateAsync, isPending } = useApiMutation({
    mutationFn: (data: BookFormType) => {
      return apiClient.patch(`books/${id}`, {
        json: data,
      })
    },
    mutationKey: ['edit-book'],
  })

  if (!data || !genreOptions || !authorsOptions) return <PageLoader />

  return (
    <ManageBookForm
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
      authorsOptions={authorsOptions}
      genreOptions={genreOptions}
      isGenrePending={isGenrePending}
      isAuthorsPending={isAuthorsPending}
    />
  )
}

export default EditBook
