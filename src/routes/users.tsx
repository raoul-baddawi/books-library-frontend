import { createFileRoute } from '@tanstack/react-router'

import PrivateLayout from '$/lib/layouts/PrivateLayout'
import UsersListing from '$/features/users-table/UsersListing'

export const Route = createFileRoute('/users')({
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
