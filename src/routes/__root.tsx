import { createRootRoute, Outlet } from '@tanstack/react-router'

import Toast from '$/lib/components/ui/Toast'

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toast />
    </>
  ),
})
