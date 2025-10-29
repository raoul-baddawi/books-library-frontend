import { createFileRoute } from '@tanstack/react-router'

import PrivateLayout from '$/lib/layouts/PrivateLayout'
import ExamplesListing from '$/features/examples/table-context/ExamplesListing'

export const Route = createFileRoute('/books')({
  component: BooksPage,
})

function BooksPage() {
  return (
    <PrivateLayout>
      <h2 className="mb-4 text-xl font-semibold">Books</h2>
      <ExamplesListing />
    </PrivateLayout>
  )
}
