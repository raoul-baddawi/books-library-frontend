import { cn } from '$/lib/utils/styling'

import SortAscIcon from '../components/icons/SortAscIcon'
import SortDescIcon from '../components/icons/SortDescIcon'
import SortIcon from '../components/icons/SortIcon'
import { useEnhancedTable } from './EnhancedTableProvider'
import type { EnhancedTableSorting } from './types'

type Props<TSelectedData> = {
  selector: keyof TSelectedData
  title: string
  className?: string
}

export default function EnhancedTableSortableColumnHeader<TSelectedData>({
  selector,
  title,
  className,
}: Props<TSelectedData>) {
  const { sorting, handleSetSorting, clearSorting } = useEnhancedTable<
    unknown,
    TSelectedData
  >()

  const handleSort = () => {
    let { key, order } = sorting || {}

    if (key !== selector) {
      key = selector
      order = 'desc'
    } else {
      if (order === 'asc') {
        clearSorting()
        return
      }

      if (order === 'desc') {
        order = 'asc'
      } else {
        order = 'desc'
      }
    }
    handleSetSorting({ key, order })
  }

  return (
    <button
      className={cn('flex items-center justify-center gap-2', className)}
      type="button"
      onClick={handleSort}
    >
      <SortingCarets sorting={sorting} selector={selector} />
      {title}
    </button>
  )
}

function SortingCarets<T>({
  selector,
  sorting,
}: {
  sorting: EnhancedTableSorting<T> | undefined
  selector: keyof T
}) {
  const { key, order } = sorting || {}

  const isSortedCell = key === selector
  const isAsc = isSortedCell && order === 'asc'
  const isDesc = isSortedCell && order === 'desc'
  const isNone = !isAsc && !isDesc
  return (
    <span>
      {isDesc && <SortDescIcon width={6} />}
      {isAsc && <SortAscIcon width={6} />}
      {isNone && <SortIcon width={6} />}
    </span>
  )
}
