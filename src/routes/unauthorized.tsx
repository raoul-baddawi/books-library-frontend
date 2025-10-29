import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/unauthorized')({
  component: Unauthorized,
})

function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-lg rounded bg-white p-8 text-center shadow">
        <h1 className="text-2xl font-semibold mb-2">Access denied</h1>
        <p className="text-neutral-medium">
          You do not have permission to view this page.
        </p>
      </div>
    </div>
  )
}
