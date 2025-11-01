import { createFileRoute } from '@tanstack/react-router'

import PrivateLayout from '$/lib/layouts/PrivateLayout'
import UsersListing from '$/features/admin-users/users-table/UsersListing'
import { getAllUsers } from '$/features/admin-users/users-table/api'
import { ensureAdmin } from '$/lib/utils/prefetchers'

export const Route = createFileRoute('/users')({
  beforeLoad: async ({ context }) => {
    await ensureAdmin(context.queryClient)
  },
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData({
      queryKey: [
        'getAllUsers',
        { search: '' },
        { key: 'id', order: 'desc' },
        { offset: 0, limit: 10 },
      ],
      queryFn: () =>
        getAllUsers(
          { search: '' },
          { offset: 0, limit: 10 },
          { key: 'id', order: 'desc' },
        ),
    })
  },
  component: UsersPage,
})

function UsersPage() {
  return (
    <div className="col-span-1 row-span-1">
      <PrivateLayout>
        <UsersListing />
      </PrivateLayout>
    </div>
  )
}
