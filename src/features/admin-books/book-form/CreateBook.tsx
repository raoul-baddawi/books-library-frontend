import ManageBookForm from './ManageBookForm'
import useApiMutation from '$/lib/hooks/useApiMutation'
import { BookFormType } from './validations'
import { apiClient } from '$/lib/utils/apiClient'
import { useRouter } from '@tanstack/react-router'
import {
  useGenreOptions,
  useAuthorsOptions,
} from '$/lib/api-hooks/api-select-options'

function CreateBook() {
  const router = useRouter()
  const { data: genreOptions, isPending: isGenrePending } = useGenreOptions()
  const { data: authorsOptions, isPending: isAuthorsPending } =
    useAuthorsOptions()

  const { mutateAsync, isPending } = useApiMutation({
    mutationFn: (data: BookFormType) => {
      return apiClient.post('Books', {
        json: data,
      })
    },
    mutationKey: ['create-Book'],
  })
  return (
    <ManageBookForm
      defaultValues={{
        authorId: '',
        genre: '',
        description: '',
        name: '',
      }}
      isPending={isPending}
      onSubmit={(data) =>
        mutateAsync(data).then(() => {
          router.history.back()
        })
      }
      onInvalidSubmit={(errors) => console.log(errors)}
      authorsOptions={authorsOptions}
      genreOptions={genreOptions}
      isGenrePending={isGenrePending}
      isAuthorsPending={isAuthorsPending}
    />
  )
}

export default CreateBook
