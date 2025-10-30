import { EnhancedTableSorting } from '$/features/shared/tables/enhanced-table'
import { apiClient } from '$/lib/utils/apiClient'
import { Pagination } from '$/lib/utils/types'

import { UserTableFiltersType, UserTableResponseType } from './types'

const baseUrl = 'users'

export const getAllUsers = async (
  filters?: UserTableFiltersType,
  pagination?: Pagination,
  sorting?: EnhancedTableSorting<UserTableResponseType>,
): Promise<UserTableResponseType> => {
  return await apiClient
    .post(`${baseUrl}/get-all`, {
      json: { filters, pagination, sorting },
    })
    .json()
}

// return new Promise((resolve) => {
//   setTimeout(() => {
//     resolve({
//       count: 3,
//       data: Array.from({ length: 3 }, (_, index) => ({
//         id: index + 1,
//         firstName: `FirstName${index + 1}`,
//         lastName: `LastName${index + 1}`,
//         email: `user${index + 1}@example.com`,
//         role: 'ADMIN',
//         createdAt: new Date().toISOString(),
//       })),
//     })
//   }, 1000)
// })
