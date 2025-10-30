import { EnhancedTable } from '$/features/shared/tables/enhanced-table'
import { TableColumn } from '$/features/shared/tables/table/Table'
import { formatDate } from '$/lib/utils/date.functions'
import { encodeId } from '$/lib/utils/misc'
import { useRouter } from '@tanstack/react-router'
import DeleteItemComponent from '../../shared/delete-popup/DeleteItemComponent'

import { UserTableType } from './types'

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
    header: () => <div className="text-start">Creation Date</div>,
  },
  {
    selector: 'fullName',
    title: 'Full Name',

    header: () => <div className="text-start">Full Name</div>,
  },
  {
    selector: 'email',
    title: 'Email',

    cell: (cell) => {
      return <div className="min-w-30">{cell.getValue()}</div>
    },
    header: () => <div className="text-start">Email</div>,
  },
  {
    selector: 'actions',
    title: 'Actions',
    meta: {
      className: 'w-0 min-w-[100px]',
    },
    cell: (cell) => {
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

  return (
    <div className="flex gap-2.5 rounded-2xl border border-table-gray bg-white grow row-span-2">
      <EnhancedTable<UserTableType>
        tableClassName="rounded-lg border-none"
        paginatable
        rowClassName={() => 'hover:bg-neutral-light/30'}
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
