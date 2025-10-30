import { createFileRoute } from '@tanstack/react-router'
import PublicLayout from '$/lib/layouts/PublicLayout'
import LandingPage from '$/features/landing/LandingPage'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <PublicLayout>
      <LandingPage />
    </PublicLayout>
  )
}
