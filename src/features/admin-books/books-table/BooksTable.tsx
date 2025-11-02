import { useRouter } from '@tanstack/react-router'
import { useDebounceCallback } from 'usehooks-ts'

import {
  EnhancedTable,
  EnhancedTableSortableColumnHeader,
} from '$/features/shared/tables/enhanced-table'
import { TableColumn } from '$/features/shared/tables/table/Table'
import { formatDate } from '$/lib/utils/date.functions'
import { encodeId } from '$/lib/utils/misc'

import DeleteItemComponent from '../../shared/delete-popup/DeleteItemComponent'
import { BookTableType } from './types'

const BookTableHeaders: TableColumn<BookTableType>[] = [
  {
    selector: 'id',
    title: 'ID',
    meta: {
      className: 'min-w-[60px] w-0',
    },
    header: () => (
      <EnhancedTableSortableColumnHeader<BookTableType>
        title="ID"
        selector="id"
      />
    ),
  },
  {
    selector: 'createdAt',
    title: 'Creation Date',
    meta: {
      className: 'w-0 min-w-[120px]',
    },
    cell: (cell) => {
      return <div>{formatDate(cell.getValue())}</div>
    },
    header: () => (
      <EnhancedTableSortableColumnHeader<BookTableType>
        title="Creation Date"
        selector="createdAt"
      />
    ),
  },
  {
    selector: 'name',
    title: 'Name',
    meta: {
      className: 'w-0 min-w-[320px]',
    },
    header: () => <div className="text-start">Name</div>,
  },
  {
    selector: 'description',
    title: 'Description',
    meta: {
      className: 'w-0 min-w-[420px]',
    },
    cell: (cell) => {
      return <div className="min-w-30">{cell.getValue()}</div>
    },
    header: () => <div className="text-start">Description</div>,
  },
  {
    selector: 'genre',
    title: 'Genre',
    meta: {
      className: 'w-0 min-w-[220px]',
    },
    cell: (cell) => {
      return <div className="w-30 flex">{cell.getValue()}</div>
    },
    header: () => <div className="text-start">Genre</div>,
  },
  {
    selector: 'authorName',
    title: 'Author Name',
    meta: {
      className: 'w-0 min-w-[220px]',
    },
    cell: (cell) => {
      return <div className="w-30 flex">{cell.getValue()}</div>
    },
    header: () => <div className="text-start">Author Name</div>,
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
          title="Delete this Book?"
          description="Are you sure you want to delete this Book? This action cannot be undone."
          url={`books/delete/${cell.row.original.id}`}
          mutationKey={['deleteBook']}
          invalidateKeys={['getAllBooks']}
        />
      )
    },
    header: () => <div className="text-center">Actions</div>,
  },
]

export default function BookTable() {
  const router = useRouter()
  const debouncedPrefetch = useDebounceCallback((bookId: number) => {
    router.preloadRoute({
      to: `/book/${encodeId(bookId)}`,
    })
  }, 500)
  return (
    <div className="flex gap-2.5 rounded-2xl border border-table-gray bg-white grow row-span-2">
      <EnhancedTable<BookTableType>
        tableClassName="rounded-lg border-none"
        paginatable
        rowClassName={() => 'hover:bg-neutral-light/30'}
        onRowClick={(row) =>
          router.navigate({
            to: `/book/${encodeId(row.original.id)}`,
          })
        }
        onRowMouseEnter={(row) => {
          debouncedPrefetch(row.original.id)
        }}
        columns={BookTableHeaders}
      />
    </div>
  )
}
