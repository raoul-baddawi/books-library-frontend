import BookTable from './BooksTable'
import BookTableFilters from './BooksTableFilters'
import BookTableProvider from './BooksTableProvider'

function BooksListing() {
  return (
    <BookTableProvider>
      <div className="grid grid-cols-1 grid-rows-[auto_1fr] col-span-1 row-span-1 h-full gap-3">
        <BookTableFilters />

        <BookTable />
      </div>
    </BookTableProvider>
  )
}

export default BooksListing
