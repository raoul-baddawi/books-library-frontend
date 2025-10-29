/* eslint-disable react-refresh/only-export-components */
import {
  type QueryKey,
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query'
import type { Updater } from '@tanstack/react-table'
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { KeyValueObject, SortOrder } from '../types'
import type {
  EnhancedTableContextType,
  EnhancedTableQueryFn,
  EnhancedTableSorting,
} from './types'

const EnhancedTableContext = createContext<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  EnhancedTableContextType<any, any, any>
>({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queryResult: {} as UseQueryResult<any, any>,
  queryKey: [],
  sorting: undefined,
  filters: {},
  selectedRows: {},
  handleSetFilters: () => {},
  resetFilters: () => {},
  handleSetSorting: () => {},
  clearSorting: () => {},
  onRowSelectionChange: () => {},
  getSelectedRows: () => [],
  dataSelector: () => [],
  prioritizedRowId: null,
  prioritizeRow: () => {},
  clearPrioritizedRow: () => {},
  pagination: { offset: 0, limit: 10 },
  paginationHandlers: {
    totalNumberOfPages: 0,
    currentPage: 0,
    pageLimit: 10,
    onNextClick: () => {},
    onPreviousClick: () => {},
    onSetPageNumber: () => {},
    onSetPageLimit: () => {},
  },
})

type Props<TData, TSelectedData, TFilters extends KeyValueObject> = {
  initialFilters?: TFilters
  selectable?: boolean
  queryOptions: Omit<
    UseQueryOptions<TData, unknown, TData, QueryKey>,
    'queryFn'
  > & {
    queryFn: EnhancedTableQueryFn<TData, TFilters>
  }
  dataSelector: (data: TData) => TSelectedData[]
  totalCountSelector?: (data: TData) => number
}

export default function EnhancedTableProvider<
  TData,
  TSelectedData,
  TFilters extends KeyValueObject = KeyValueObject,
>({
  initialFilters,
  queryOptions,
  dataSelector,
  totalCountSelector,
  children,
}: PropsWithChildren<Props<TData, TSelectedData, TFilters>>) {
  const [sorting, setSorting] = useState<EnhancedTableSorting<TData>>()
  const [filters, setFilters] = useState<TFilters>(
    initialFilters ?? ({} as TFilters),
  )
  const [prioritizedRowId, setPrioritizedRowId] = useState<
    string | number | null
  >(null)

  const [pagination, setPagination] = useState({ offset: 0, limit: 10 })
  const [totalNumberOfPages, setTotalNumberOfPages] = useState(1)
  const [selectedRows, setSelectedRows] = useState({})
  const getSortingWithDefault = useMemo(() => {
    return sorting ?? { key: 'id' as keyof TData, order: 'desc' as SortOrder }
  }, [sorting])

  const queryKey: QueryKey = [
    ...queryOptions.queryKey,
    filters,
    getSortingWithDefault,
    pagination,
  ]

  const queryResult = useQuery({
    ...queryOptions,
    queryFn: async () =>
      queryOptions.queryFn({
        filters,
        sorting: {
          key: getSortingWithDefault.key,
          order: getSortingWithDefault.order,
        },
        pagination,
      }),
    queryKey,
  })

  const enhancedDataSelector = useMemo(() => {
    return (data: TData) => {
      const originalData = dataSelector(data)

      if (!prioritizedRowId) {
        return originalData
      }

      const prioritizedIndex = originalData.findIndex(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (row: any) => row.id === prioritizedRowId,
      )

      if (prioritizedIndex === -1) {
        return originalData
      }

      // Reorder the data to put the prioritized row first
      const reorderedData = [...originalData]
      const [prioritizedItem] = reorderedData.splice(prioritizedIndex, 1)
      return [prioritizedItem, ...reorderedData]
    }
  }, [dataSelector, prioritizedRowId])
  const handlers = useMemo(() => {
    return {
      handleSetFilters: <K extends keyof TFilters>(
        key: K,
        filter: TFilters[K],
      ) => {
        setPagination((p) => ({ ...p, offset: 0 }))
        setFilters((f) => ({ ...f, [key]: filter }))
      },
      handleSetSorting: (sorting: EnhancedTableSorting<TData>) => {
        setPagination((p) => ({ ...p, offset: 0 }))
        setSorting(sorting ?? undefined)
      },
      onRowSelectionChange: (selectedRows: Updater<Record<number, boolean>>) =>
        setSelectedRows(selectedRows),
      clearSelectedRows: () => setSelectedRows({}),
      clearSorting: () => setSorting(undefined),
    }
  }, [])

  const tableHooks = useMemo(() => {
    return {
      getSelectedRows: () => {
        const rowIndexes = Object.keys(selectedRows).map(Number)
        const selectedRowsData: TSelectedData[] = []

        if (queryResult.data) {
          const parsedData = dataSelector(queryResult.data)
          for (const index of rowIndexes) {
            const rowData = parsedData[index]
            if (!rowData) {
              throw new Error(`Failed to get data for index ${index}`)
            }
            selectedRowsData.push(rowData)
          }
        }

        return selectedRowsData
      },
    }
  }, [selectedRows, queryResult.data, dataSelector])

  useEffect(() => {
    if (queryResult.data && totalCountSelector) {
      const totalCount = totalCountSelector(queryResult.data)
      setTotalNumberOfPages(Math.ceil(totalCount / pagination.limit) || 1)
    }
  }, [queryResult.data, pagination.limit, totalCountSelector])

  useEffect(() => {
    setSelectedRows({})
  }, [queryResult.data])

  const paginationHandlers = useMemo(() => {
    return {
      pageLimit: pagination.limit,
      totalNumberOfPages: totalNumberOfPages,
      currentPage: pagination.offset + 1,
      onNextClick: () => setPagination((p) => ({ ...p, offset: p.offset + 1 })),
      onPreviousClick: () =>
        setPagination((p) => ({ ...p, offset: p.offset - 1 })),
      onSetPageNumber: (pageNb: number) =>
        setPagination((p) => ({ ...p, offset: pageNb - 1 })),
      onSetPageLimit: (limit: number) => {
        setPagination((p) => ({ ...p, limit }))
      },
    }
  }, [pagination, totalNumberOfPages])

  useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters)
    }
  }, [initialFilters])
  return (
    <EnhancedTableContext.Provider
      value={{
        queryResult,
        queryKey,
        filters,
        sorting: { key: sorting?.key ?? 'id', order: sorting?.order ?? 'desc' },
        selectedRows,
        pagination,
        paginationHandlers,
        resetFilters: () => {
          setFilters({} as TFilters)
        },
        dataSelector: enhancedDataSelector,
        prioritizedRowId,
        prioritizeRow: (rowId: string | number) => setPrioritizedRowId(rowId),
        clearPrioritizedRow: () => setPrioritizedRowId(null),
        ...tableHooks,
        ...handlers,
      }}
    >
      {children}
    </EnhancedTableContext.Provider>
  )
}

export function useEnhancedTable<
  TData,
  TSelectedData,
  TFilter extends KeyValueObject = KeyValueObject,
>() {
  return useContext(EnhancedTableContext) as EnhancedTableContextType<
    TData,
    TSelectedData,
    Partial<TFilter>
  >
}
