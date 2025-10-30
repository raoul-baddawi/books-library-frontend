import { PropsWithChildren } from 'react'

import { EnhancedTableProvider } from '$/features/shared/tables/enhanced-table'

import { getAllUsers } from './api'
import {
  UserTableFiltersType,
  UserTableResponseType,
  UserTableType,
} from './types'

type UserTableProviderProps = {
  outerFilters?: UserTableFiltersType
}
export default function UserTableProvider({
  outerFilters,
  children,
}: PropsWithChildren<UserTableProviderProps>) {
  return (
    <EnhancedTableProvider<
      UserTableResponseType,
      UserTableType,
      UserTableFiltersType
    >
      initialFilters={outerFilters}
      dataSelector={(response) => response.data}
      totalCountSelector={(response) => response.count}
      queryOptions={{
        queryFn: async ({ filters, pagination, sorting }) => {
          return getAllUsers(
            {
              ...filters,
              ...outerFilters,
            },
            pagination,
            sorting,
          )
        },
        queryKey: ['getAllUsers', outerFilters],
        refetchOnMount: true,
      }}
    >
      {children}
    </EnhancedTableProvider>
  )
}
