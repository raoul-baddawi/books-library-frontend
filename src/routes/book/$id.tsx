import { createFileRoute, useParams } from '@tanstack/react-router'

import EditBook from '$/features/admin-books/book-form/EditBook'
import { BookFormType } from '$/features/admin-books/book-form/validations'
import { SelectOptionType } from '$/lib/api-hooks/api-select-options'
import useApiQuery from '$/lib/hooks/useApiQuery'
import { apiClient } from '$/lib/utils/apiClient'
import { decodeId } from '$/lib/utils/misc'
import { ensureAdminOrAuthor } from '$/lib/utils/prefetchers'

export const Route = createFileRoute('/book/$id')({
  beforeLoad: async ({ context }) => {
    await ensureAdminOrAuthor(context.queryClient)
  },
  loader: async ({ context, params }) => {
    const decodedId = decodeId(params.id)

    await context.queryClient.ensureQueryData({
      queryKey: ['book-detail', decodedId],
      queryFn: async () =>
        await apiClient.get<BookFormType>(`books/${decodedId}`).json(),
    })

    await context.queryClient.ensureQueryData({
      queryKey: ['genre-options'],
      queryFn: async () =>
        await apiClient.get<SelectOptionType[]>('books/genre-options').json(),
    })

    await context.queryClient.ensureQueryData({
      queryKey: ['authors-options'],
      queryFn: async () =>
        await apiClient.get<SelectOptionType[]>('users/select-options').json(),
    })
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = useParams({ from: '/book/$id' })
  const decodedId = decodeId(id)
  const { data } = useApiQuery({
    queryKey: ['book-detail', decodedId],
    queryFn: async ({ apiClient }) =>
      await apiClient.get<BookFormType>(`books/${decodedId}`).json(),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  })

  return (
    <div className="overflow-auto w-full p-4 bg-white h-full gap-6 flex flex-col">
      <h1 className="text-4xl font-bold">Edit Book</h1>
      <EditBook id={decodedId!} data={data} />
    </div>
  )
}
