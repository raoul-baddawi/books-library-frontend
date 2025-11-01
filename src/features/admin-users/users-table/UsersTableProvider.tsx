import { PropsWithChildren } from 'react'

import { EnhancedTableProvider } from '$/features/shared/tables/enhanced-table'

import { getAllUsers } from './api'
import {
  UserTableFiltersType,
  UserTableResponseType,
  UserTableType,
} from './types'

export default function UserTableProvider({ children }: PropsWithChildren) {
  return (
    <EnhancedTableProvider<
      UserTableResponseType,
      UserTableType,
      UserTableFiltersType
    >
      dataSelector={(response) => response.data}
      totalCountSelector={(response) => response.count}
      queryOptions={{
        queryFn: async ({ filters, pagination, sorting }) => {
          return getAllUsers(filters, pagination, sorting)
        },
        queryKey: ['getAllUsers'],
        refetchOnMount: true,
      }}
    >
      {children}
    </EnhancedTableProvider>
  )
}
