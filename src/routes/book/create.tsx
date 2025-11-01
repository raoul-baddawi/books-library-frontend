import CreateBook from '$/features/admin-books/book-form/CreateBook'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/book/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="w-full p-4 bg-white h-full gap-6 flex flex-col">
      <h1 className="text-4xl font-bold">Create Book</h1>
      <CreateBook />
    </div>
  )
}
