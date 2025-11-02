import { createFileRoute } from '@tanstack/react-router'

import CreateBook from '$/features/admin-books/book-form/CreateBook'
import { SelectOptionType } from '$/lib/api-hooks/api-select-options'
import { apiClient } from '$/lib/utils/apiClient'
import { ensureAdminOrAuthor } from '$/lib/utils/prefetchers'

export const Route = createFileRoute('/book/create')({
  beforeLoad: async ({ context }) => {
    await ensureAdminOrAuthor(context.queryClient)
  },
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData({
      queryKey: ['genre-options'],
      queryFn: async () =>
        await apiClient.get<SelectOptionType[]>('books/genre-options').json(),
    })

    await context.queryClient.ensureQueryData({
      queryKey: ['authors-options'],
      queryFn: async () =>
        await apiClient
          .get<
            SelectOptionType[]
          >('users/select-options', { searchParams: { isValidAuthors: false } })
          .json(),
    })
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="overflow-auto w-full p-4 bg-white h-full gap-6 flex flex-col">
      <h1 className="text-4xl font-bold">Create Book</h1>
      <CreateBook />
    </div>
  )
}
