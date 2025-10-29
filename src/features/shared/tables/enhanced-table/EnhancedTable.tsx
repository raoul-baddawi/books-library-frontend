import type { ComponentProps } from 'react'

import Table from '../table/Table'
import { KeyValueObject } from '../types'
import { useEnhancedTable } from './EnhancedTableProvider'

type Props<T> = Pick<
  ComponentProps<typeof Table<T>>,
  | 'columns'
  | 'selectable'
  | 'paginatable'
  | 'noDataComponent'
  | 'errorComponent'
  | 'contextMenu'
  | 'onRowClick'
  | 'headerClassName'
  | 'tableClassName'
  | 'onContextMenu'
  | 'rowClassName'
  | 'hideHeader'
> & {
  className?: string
}

export default function EnhancedTable<
  TSelectedData,
  TFilters extends KeyValueObject = KeyValueObject,
>(tableProps: Props<TSelectedData>) {
  const {
    queryResult: { data, isPending, isError },
    selectedRows,
    paginationHandlers,
    dataSelector,
    onRowSelectionChange,
    // we don't care about the type of the data here as we are only concerned
    // with the selected data which will be passed to the Table component
  } = useEnhancedTable<unknown, TSelectedData, TFilters>()
  const { contextMenu, ...props } = tableProps
  return (
    // @ts-expect-error typescript generics are not compatible with data passed
    // from both props and context. If you want to debug or change the props in
    // the future you can use the commented code below which is type-safe
    <Table<TSelectedData>
      {...props}
      contextMenu={contextMenu}
      data={data ? dataSelector(data) : undefined}
      isPendingData={isPending}
      isErroredData={isError}
      selectedRows={selectedRows}
      className={tableProps.className}
      onRowSelectionChange={onRowSelectionChange}
      pagination={paginationHandlers}
      rowClassName={tableProps.rowClassName}
    />
  )
}
