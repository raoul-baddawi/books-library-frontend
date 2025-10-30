import DotLoader from '$/lib/components/loaders/DotLoader'

function BooksLoader() {
  return (
    <div className="flex justify-between gap-3 flex-col items-center text-center py-4 text-primary">
      <DotLoader size="lg" />
      Loading Books
    </div>
  )
}

export default BooksLoader
