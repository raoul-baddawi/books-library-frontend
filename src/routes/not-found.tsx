import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/not-found')({
  component: NotFound,
})

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-lg rounded bg-white p-8 text-center shadow">
        <h1 className="text-2xl font-semibold mb-2">404 — Not Found</h1>
        <p className="text-neutral-medium">
          The page you requested could not be found.
        </p>
      </div>
    </div>
  )
}
