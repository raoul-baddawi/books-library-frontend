import { Column, Table } from '@tanstack/react-table'
import { CSSProperties } from 'react'

export const getCommonPinningStyles = <T>(
  column: Column<T>,
  _: Column<T, unknown>[],
  isBodyTd: boolean,
  row_index: number,
  cell_index: number,
  row_cells_length: number,
  table?: Table<T>,
): CSSProperties => {
  const isPinned = column.getIsPinned()
  const isLastLeftPinnedColumn =
    isPinned === 'left' && column.getIsLastColumn('left')
  const isFirstRightPinnedColumn =
    isPinned === 'right' && column.getIsFirstColumn('right')
  const zIndexIfCellIndexIsTheLastCell =
    cell_index === row_cells_length - 1 ? 100 - row_index : 0
  const defaultZIndex = table ? table.getRowModel().rows.length - row_index : 0

  return {
    boxShadow: isLastLeftPinnedColumn
      ? '-1px 0 0 0 #f0f0f0 inset'
      : isFirstRightPinnedColumn
        ? '1px 0 0 0 #f0f0f0 inset'
        : undefined,
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    opacity: 1,
    background: isFirstRightPinnedColumn && isBodyTd ? 'white' : '',
    position: isPinned ? 'sticky' : 'relative',
    zIndex: isPinned ? zIndexIfCellIndexIsTheLastCell : defaultZIndex,
  }
}
