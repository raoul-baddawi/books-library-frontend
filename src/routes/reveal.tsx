import { createFileRoute } from '@tanstack/react-router'

import RevealPage from '$/features/gender-reveal/RevealPage'

export const Route = createFileRoute('/reveal')({
  component: RevealPage,
})
