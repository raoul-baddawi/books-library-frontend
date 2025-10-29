import { PropsWithChildren } from 'react'

import { EnhancedTableProvider } from '$/features/shared/tables/enhanced-table'

import { getAllExamples } from './api'
import {
  ExampleTableFiltersType,
  ExampleTableResponseType,
  ExampleTableType,
} from './types'

type ExampleTableProviderProps = {
  outerFilters?: ExampleTableFiltersType
}
export default function ExampleTableProvider({
  outerFilters,
  children,
}: PropsWithChildren<ExampleTableProviderProps>) {
  return (
    <EnhancedTableProvider<
      ExampleTableResponseType,
      ExampleTableType,
      ExampleTableFiltersType
    >
      initialFilters={outerFilters}
      dataSelector={(response) => response.data}
      totalCountSelector={(response) => response.count}
      queryOptions={{
        queryFn: async ({ filters, pagination, sorting }) => {
          return getAllExamples(
            {
              ...filters,
              ...outerFilters,
            },
            pagination,
            sorting,
          )
        },
        queryKey: ['getAllExamples', outerFilters],
        refetchOnMount: true,
      }}
    >
      {children}
    </EnhancedTableProvider>
  )
}
