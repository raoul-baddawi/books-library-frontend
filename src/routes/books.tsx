import { createFileRoute } from '@tanstack/react-router'

import PrivateLayout from '$/lib/layouts/PrivateLayout'
import BooksListing from '$/features/admin-books/books-table/BooksListing'
import { getAllBooks } from '$/features/admin-books/books-table/api'
import { ensureAdminOrAuthor } from '$/lib/utils/prefetchers'

export const Route = createFileRoute('/books')({
  beforeLoad: async ({ context }) => {
    await ensureAdminOrAuthor(context.queryClient)
  },
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData({
      queryKey: [
        'getAllBooks',
        undefined,
        { search: '' },
        { key: 'id', order: 'desc' },
        { offset: 0, limit: 10 },
      ],
      queryFn: () =>
        getAllBooks(
          { search: '' },
          { offset: 0, limit: 10 },
          {
            key: 'id',
            order: 'desc',
          },
        ),
    })
  },
  component: BooksPage,
})

function BooksPage() {
  return (
    <div className="col-span-1 row-span-1">
      <PrivateLayout>
        <BooksListing />
      </PrivateLayout>
    </div>
  )
}
