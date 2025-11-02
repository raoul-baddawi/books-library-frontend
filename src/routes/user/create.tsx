import { createFileRoute } from '@tanstack/react-router'

import CreateUser from '$/features/admin-users/user-form/CreateUser'
import { ensureAdmin } from '$/lib/utils/prefetchers'

export const Route = createFileRoute('/user/create')({
  beforeLoad: async ({ context }) => {
    await ensureAdmin(context.queryClient)
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="overflow-auto w-full p-4 bg-white h-full gap-6 flex flex-col">
      <h1 className="text-4xl font-bold">Create User</h1>
      <CreateUser />
    </div>
  )
}
