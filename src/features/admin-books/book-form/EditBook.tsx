import { useRouter } from '@tanstack/react-router'

import {
  useAuthorsOptions,
  useGenreOptions,
} from '$/lib/api-hooks/api-select-options'
import PageLoader from '$/lib/components/loaders/PgaeLoader'
import useApiMutation from '$/lib/hooks/useApiMutation'
import { apiClient } from '$/lib/utils/apiClient'
import { filterAndJoinUploadedFilesWithUrls } from '$/lib/utils/media-utils/functions'

import ManageBookForm from './ManageBookForm'
import { BookFormType } from './validations'

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
    mutationFn: async (data: BookFormType) => {
      const media = await filterAndJoinUploadedFilesWithUrls(
        'books',
        data.media,
      )

      return apiClient.patch(`books/${id}`, {
        json: {
          ...data,
          media,
        },
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
      authorsOptions={authorsOptions}
      genreOptions={genreOptions}
      isGenrePending={isGenrePending}
      isAuthorsPending={isAuthorsPending}
    />
  )
}

export default EditBook
