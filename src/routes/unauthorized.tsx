import Button from '$/lib/components/ui/buttons/Button'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { Ban } from 'lucide-react'

export const Route = createFileRoute('/unauthorized')({
  component: Unauthorized,
})

function Unauthorized() {
  const router = useRouter()

  const handlePrefetchHome = () => {
    router.preloadRoute({ to: '/' })
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray/10">
      <div className="max-w-lg rounded bg-white p-8 text-center shadow-lg">
        <div className="mb-4 text-red mx-auto flex justify-center">
          <Ban size={40} />
        </div>
        <h1 className="text-3xl font-bold mb-4 text-gray">Access Denied</h1>
        <p className="text-gray/70 mb-6">
          You do not have permission to view this page.
        </p>
        <Button
          variant="btn-primary"
          onMouseEnter={handlePrefetchHome}
          onClick={() => router.history.back()}
          className="mx-auto inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/80 transition-colors font-medium"
        >
          Go Back
        </Button>
      </div>
    </div>
  )
}
