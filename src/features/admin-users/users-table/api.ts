import { EnhancedTableSorting } from '$/features/shared/tables/enhanced-table'
import { apiClient } from '$/lib/utils/apiClient'
import { Pagination } from '$/lib/utils/types'

import {
  UserTableFiltersType,
  UserTableResponseType,
  UserTableType,
} from './types'

const baseUrl = 'users'

export const getAllUsers = async (
  filters?: UserTableFiltersType,
  pagination?: Pagination,
  sorting?: EnhancedTableSorting<UserTableType>,
): Promise<UserTableResponseType> => {
  return await apiClient
    .post(`${baseUrl}/get-all`, {
      json: { filters, pagination, sorting },
    })
    .json()
}
