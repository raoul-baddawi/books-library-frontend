// import { useLocation, useRouter } from '@tanstack/react-router'

import { EnhancedTable } from '$/features/shared/tables/enhanced-table'
import { TableColumn } from '$/features/shared/tables/table/Table'
import { formatDate } from '$/lib/utils/date.functions'
// import { encodeId } from '$/lib/utils/misc'

import { UserTableType } from './types'
// import { UserRoleType } from '$/lib/providers/AuthProvider'

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
      return <div className="w-fit">{formatDate(cell.getValue())}</div>
    },
    header: () => <div className="text-start">Creation Date</div>,
  },
  {
    selector: 'fullName',
    title: 'Full Name',
    meta: {
      className: 'min-w-[180px] w-0',
    },
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
]

export default function UserTable() {
  // const router = useRouter()
  // const location = useLocation()
  // const isArchivesPage = location.pathname.includes('/archives')

  return (
    <div className="flex  gap-2.5 rounded-2xl border border-table-gray bg-white">
      <EnhancedTable<UserTableType>
        tableClassName="rounded-lg border-none"
        paginatable
        rowClassName={() => 'hover:bg-neutral-light/30'}
        // onRowClick={(row) =>
        //   router.navigate({
        //     to: `/repair-application/${encodeId(Number(row.original.id))}`,
        //     search: isArchivesPage ? { isArchived: true } : undefined,
        //   })
        // }
        columns={userTableHeaders}
      />
    </div>
  )
}
