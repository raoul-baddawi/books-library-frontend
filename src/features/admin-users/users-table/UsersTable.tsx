import {
  EnhancedTable,
  EnhancedTableSortableColumnHeader,
} from '$/features/shared/tables/enhanced-table'
import { TableColumn } from '$/features/shared/tables/table/Table'
import { formatDate } from '$/lib/utils/date.functions'
import { encodeId } from '$/lib/utils/misc'
import { useRouter } from '@tanstack/react-router'
import DeleteItemComponent from '../../shared/delete-popup/DeleteItemComponent'

import { UserTableType } from './types'
import UserRoleTableCell from './UserRoleTableCell'
import { useDebounceCallback } from 'usehooks-ts'

const userTableHeaders: TableColumn<UserTableType>[] = [
  {
    selector: 'id',
    title: 'ID',
    meta: {
      className: 'min-w-[60px] w-0',
    },
    header: () => <div className="text-start">ID</div>,
  },
  {
    selector: 'createdAt',
    title: 'Creation Date',

    cell: (cell) => {
      return <div>{formatDate(cell.getValue())}</div>
    },
    header: () => (
      <EnhancedTableSortableColumnHeader<UserTableType>
        title="Creation Date"
        selector="createdAt"
      />
    ),
  },
  {
    selector: 'fullName',
    title: 'Full Name',

    header: () => <div className="text-start">Full Name</div>,
  },
  {
    selector: 'email',
    title: 'Email',
    meta: {
      className: 'w-0 min-w-[320px]',
    },
    cell: (cell) => {
      return <div className="min-w-30">{cell.getValue()}</div>
    },
    header: () => <div className="text-start">Email</div>,
  },
  {
    selector: 'role',
    title: 'Role',
    meta: {
      className: 'w-0 min-w-[220px]',
    },
    cell: (cell) => {
      return (
        <div className="w-30 flex">
          <UserRoleTableCell
            userRole={cell.getValue()}
            className="text-center"
          />
        </div>
      )
    },
    header: () => <div className="text-start">Role</div>,
  },
  {
    selector: 'actions',
    title: 'Actions',
    meta: {
      className: 'w-0 min-w-[100px]',
    },
    cell: (cell) => {
      if (cell.row.original.role === 'ADMIN') {
        return <div className="text-center">-</div>
      }
      return (
        <DeleteItemComponent
          title="Delete this user?"
          description="Are you sure you want to delete this user? This action cannot be undone."
          url={`users/delete/${cell.row.original.id}`}
          mutationKey={['deleteUser']}
          invalidateKeys={['getAllUsers']}
        />
      )
    },
    header: () => <div className="text-center">Actions</div>,
  },
]

export default function UserTable() {
  const router = useRouter()
  const debouncedPrefetch = useDebounceCallback((userId: number) => {
    router.preloadRoute({
      to: `/user/${encodeId(userId)}`,
    })
  }, 500)
  return (
    <div className="flex gap-2.5 rounded-2xl border border-table-gray bg-white grow row-span-2">
      <EnhancedTable<UserTableType>
        tableClassName="rounded-lg border-none"
        paginatable
        rowClassName={() => 'hover:bg-neutral-light/30'}
        onRowMouseEnter={(row) => {
          debouncedPrefetch(row.original.id)
        }}
        onRowClick={(row) =>
          router.navigate({
            to: `/user/${encodeId(row.original.id)}`,
          })
        }
        columns={userTableHeaders}
      />
    </div>
  )
}
