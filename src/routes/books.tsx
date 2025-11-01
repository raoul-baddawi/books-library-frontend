import { createFileRoute } from '@tanstack/react-router'

import PrivateLayout from '$/lib/layouts/PrivateLayout'
import BooksListing from '$/features/admin-books/books-table/BooksListing'

export const Route = createFileRoute('/books')({
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
