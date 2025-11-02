import {
  ColumnMeta,
  flexRender,
  type Row,
  type Table,
} from '@tanstack/react-table'
import { Fragment } from 'react/jsx-runtime'

import { valueOrNothing } from '$/lib/utils/functions'
import { cn } from '$/lib/utils/styling'

import { getCommonPinningStyles } from './styles'
import { UserRoleType } from '$/lib/providers/AuthProvider'

type Props<T> = {
  data: T[]
  table: Table<T>
  isPendingData: boolean
  isErroredData: boolean
  tableColumns: number
  noDataComponent: React.ReactNode
  errorComponent: React.ReactNode
  selectable?: boolean
  rowClassName?: (row: Row<T>) => string
  onRowClick?: (
    row: Row<T>,
    e: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
  ) => void
  onRowMouseEnter?: (
    row: Row<T>,
    e: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
  ) => void
  onContextMenu: (e: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => void
}

export default function TableBodyContent<T>({
  table,
  errorComponent,
  noDataComponent,
  data,
  tableColumns,
  isPendingData,
  isErroredData,
  onRowClick,
  rowClassName,
  selectable,
  onContextMenu,
  onRowMouseEnter,
}: Props<T>) {
  const handleRowClick = (
    e: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
    row: Row<T>,
  ) => {
    const target = e.target as HTMLElement
    const isInteractiveElement = target.closest(
      'button, input, select, textarea, [role="button"], [role="menuitem"], [role="option"], [data-radix-popper-content-wrapper]',
    )
    const hasPointerCursor = target.closest('.cursor-pointer:not(tr)')
    const isDropdownContent = target.closest(
      '[data-radix-popper-content-wrapper], [data-state]',
    )
    if (!isInteractiveElement && !hasPointerCursor && !isDropdownContent) {
      onRowClick?.(row, e)
    }
  }

  if (isPendingData) {
    return null
  }

  if (!data.length) {
    return (
      <tr className="h-32">
        <th colSpan={tableColumns}>
          {noDataComponent ? noDataComponent : 'No data found'}
        </th>
      </tr>
    )
  }

  if (isErroredData) {
    return (
      <tr>
        <th colSpan={tableColumns}>
          {errorComponent
            ? errorComponent
            : 'An error occurred while fetching data.'}
        </th>
      </tr>
    )
  }
  return table.getRowModel().rows.map((row, row_index) => {
    return (
      <Fragment key={`row-${row_index}-${row.id}`}>
        <tr
          onContextMenu={onContextMenu}
          className={cn(
            'hover:bg-gray/15 relative mx-4 h-12 cursor-default duration-200',
            row?.getIsSelected() && 'bg-gray-100',
            valueOrNothing(
              !!onRowClick &&
                (row.original as { role?: UserRoleType }).role !== 'ADMIN',
              'cursor-pointer',
            ),
            rowClassName?.(row),
          )}
          onMouseEnter={(e) => onRowMouseEnter?.(row, e)}
          onClick={(e) => handleRowClick(e, row)}
        >
          {row.getVisibleCells().map((cell, index) => {
            const meta:
              | (ColumnMeta<T, unknown> & {
                  className?: number
                })
              | undefined = cell.column.columnDef.meta
            const allColumns = table.getAllColumns()
            const row_cells_length = row.getVisibleCells()?.length
            const actionCell = cell.column.columnDef.id === 'actions'

            return (
              <td
                onClick={(e) => {
                  if (actionCell) {
                    e.stopPropagation()
                  }
                }}
                key={`${row.id}_${cell.column.columnDef.id}_${index}`}
                className={cn(
                  'border border-t-0 border-r-0 border-table-gray text-sm wrap-break-word text-left text-accent',
                  index !== 0 && 'px-2',
                  index === 0 && 'border-l-0! px-3',
                  index === 1 && selectable && 'px-3',
                  meta?.className,
                )}
                style={{
                  ...getCommonPinningStyles<T>(
                    cell.column,
                    allColumns,
                    true,
                    row_index,
                    index,
                    row_cells_length,
                    table,
                  ),
                }}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            )
          })}
        </tr>
      </Fragment>
    )
  })
}
