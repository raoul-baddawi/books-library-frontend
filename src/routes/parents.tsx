import { createFileRoute } from '@tanstack/react-router'

import ParentsPage from '$/features/gender-reveal/ParentsPage'

export const Route = createFileRoute('/parents')({
  component: ParentsPage,
})
