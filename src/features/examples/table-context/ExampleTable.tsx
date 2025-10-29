// import { useLocation, useRouter } from '@tanstack/react-router'

import { EnhancedTable } from '$/features/shared/tables/enhanced-table'
import { TableColumn } from '$/features/shared/tables/table/Table'
import { formatDate } from '$/lib/utils/date.functions'
// import { encodeId } from '$/lib/utils/misc'

import { ExampleTableType } from './types'
// import { UserRoleType } from '$/lib/providers/AuthProvider'

const exampleTableHeaders: TableColumn<ExampleTableType>[] = [
  {
    selector: 'id',
    title: 'ID',
    header: () => <div className="text-start">ID</div>,
  },
  {
    selector: 'createdAt',
    title: 'Creation Date',
    meta: {
      className: 'min-w-32',
    },
    cell: (cell) => {
      return <div className="w-fit">{formatDate(cell.getValue())}</div>
    },
    header: () => <div className="text-start">Creation Date</div>,
  },
  {
    selector: 'firstName',
    title: 'First Name',
    cell: (cell) => {
      return <div className="min-w-40">{cell.getValue()}</div>
    },
    header: () => <div className="text-start">First Name</div>,
  },
  {
    selector: 'lastName',
    title: 'Last Name',
    cell: (cell) => {
      return <div className="min-w-30">{cell.getValue()}</div>
    },
    header: () => <div className="text-start">Last Name</div>,
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

export default function ExampleTable() {
  // const router = useRouter()
  // const location = useLocation()
  // const isArchivesPage = location.pathname.includes('/archives')

  return (
    <div className="flex  gap-2.5 rounded-2xl border border-table-gray bg-white">
      <EnhancedTable<ExampleTableType>
        tableClassName="rounded-lg border-none"
        paginatable
        rowClassName={() => 'hover:bg-neutral-light/30'}
        // onRowClick={(row) =>
        //   router.navigate({
        //     to: `/repair-application/${encodeId(Number(row.original.id))}`,
        //     search: isArchivesPage ? { isArchived: true } : undefined,
        //   })
        // }
        columns={exampleTableHeaders}
      />
    </div>
  )
}
