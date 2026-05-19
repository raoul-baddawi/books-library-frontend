import { createFileRoute } from '@tanstack/react-router'

import GuestPage from '$/features/gender-reveal/GuestPage'

export const Route = createFileRoute('/')({
  component: GuestPage,
})
