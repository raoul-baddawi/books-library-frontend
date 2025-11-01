import { PropsWithChildren } from 'react'

import { EnhancedTableProvider } from '$/features/shared/tables/enhanced-table'

import { getAllBooks } from './api'
import {
  BookTableFiltersType,
  BookTableResponseType,
  BookTableType,
} from './types'

type BookTableProviderProps = {
  outerFilters?: BookTableFiltersType
}
export default function BookTableProvider({
  outerFilters,
  children,
}: PropsWithChildren<BookTableProviderProps>) {
  return (
    <EnhancedTableProvider<
      BookTableResponseType,
      BookTableType,
      BookTableFiltersType
    >
      initialFilters={outerFilters}
      dataSelector={(response) => response.data}
      totalCountSelector={(response) => response.count}
      queryOptions={{
        queryFn: async ({ filters, pagination, sorting }) => {
          return getAllBooks(
            {
              ...filters,
              ...outerFilters,
            },
            pagination,
            sorting,
          )
        },
        queryKey: ['getAllBooks', outerFilters],
        refetchOnMount: true,
      }}
    >
      {children}
    </EnhancedTableProvider>
  )
}
