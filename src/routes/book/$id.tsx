import EditBook from '$/features/admin-books/book-form/EditBook'
import { BookFormType } from '$/features/admin-books/book-form/validations'
import useApiQuery from '$/lib/hooks/useApiQuery'
import { decodeId } from '$/lib/utils/misc'
import { createFileRoute, useParams } from '@tanstack/react-router'

export const Route = createFileRoute('/book/$id')({
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
    <div className="w-full p-4 bg-white h-full gap-6 flex flex-col">
      <h1 className="text-4xl font-bold">Edit Book</h1>
      <EditBook id={decodedId!} data={data} />
    </div>
  )
}
