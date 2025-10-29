import { createFileRoute } from '@tanstack/react-router'
import PublicLayout from '$/lib/layouts/PublicLayout'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <PublicLayout>
      <div className="min-h-screen flex items-center justify-center bg-white">
        <h1 className="text-3xl font-semibold text-accent">LIBRARY page</h1>
      </div>
    </PublicLayout>
  )
}
