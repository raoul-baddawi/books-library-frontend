import { useRouter } from '@tanstack/react-router'

import {
  useAuthorsOptions,
  useGenreOptions,
} from '$/lib/api-hooks/api-select-options'
import useApiMutation from '$/lib/hooks/useApiMutation'
import { useAuth } from '$/lib/providers/AuthProvider'
import { apiClient } from '$/lib/utils/apiClient'
import { filterAndJoinUploadedFilesWithUrls } from '$/lib/utils/media-utils/functions'

import ManageBookForm from './ManageBookForm'
import { BookFormType } from './validations'

function CreateBook() {
  const router = useRouter()
  const { data: genreOptions, isPending: isGenrePending } = useGenreOptions()
  const { data: authorsOptions, isPending: isAuthorsPending } =
    useAuthorsOptions(false)
  const { user } = useAuth()

  const { mutateAsync, isPending } = useApiMutation({
    mutationFn: async (data: BookFormType) => {
      const media = await filterAndJoinUploadedFilesWithUrls(
        'books',
        data.media,
      )
      return apiClient.post('Books', {
        json: {
          ...data,
          authorId: user.role === 'AUTHOR' ? user.id.toString() : data.authorId,
          media,
        },
      })
    },
    mutationKey: ['create-Book'],
  })
  return (
    <ManageBookForm
      defaultValues={{
        authorId: user.role === 'AUTHOR' ? user.id.toString() : '',
        genre: '',
        description: '',
        name: '',
        media: [],
      }}
      isPending={isPending}
      onSubmit={(data) =>
        mutateAsync(data).then(() => {
          router.history.back()
        })
      }
      authorsOptions={authorsOptions}
      genreOptions={genreOptions}
      isGenrePending={isGenrePending}
      isAuthorsPending={isAuthorsPending}
    />
  )
}

export default CreateBook
