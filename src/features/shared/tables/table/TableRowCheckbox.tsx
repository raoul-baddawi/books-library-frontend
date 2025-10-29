import type { Row, Table } from '@tanstack/react-table'
import type { MouseEventHandler } from 'react'

type TableRowCheckboxProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  row: Row<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  table: Table<any>
  lastSelectedRow: { index: number; checked: boolean }
  handleSetLastSelectedRow: (index: number, checked: boolean) => void
}

export default function TableRowCheckbox({
  row,
  table,
  lastSelectedRow,
  handleSetLastSelectedRow,
}: TableRowCheckboxProps) {
  const handleCheckboxClick: MouseEventHandler<HTMLInputElement> = (e) => {
    e.stopPropagation() // prevents the triggering of orRowClick

    if (e.shiftKey) {
      const { rows } = table.getRowModel()
      const lastSelectedIndex = lastSelectedRow.index
      const isCurrentRowSelected = row?.getIsSelected()

      if (lastSelectedIndex >= 0) {
        const [minIndex, maxIndex] =
          lastSelectedIndex < row.index
            ? [lastSelectedIndex, row.index]
            : [row.index, lastSelectedIndex]

        for (const row of rows) {
          if (row.index >= minIndex && row.index <= maxIndex) {
            row.toggleSelected(!isCurrentRowSelected)
          }
        }
      }
    }
  }

  const handleCustomChange = () => {
    const isSelected = row?.getIsSelected()
    row.toggleSelected()
    handleSetLastSelectedRow(row.index, isSelected)
  }

  return (
    <div className="ml-4 flex items-center justify-center">
      <input
        className="size-4 hover:cursor-pointer"
        type="checkbox"
        checked={row?.getIsSelected()}
        onChange={handleCustomChange}
        onClick={handleCheckboxClick}
      />
    </div>
  )
}
