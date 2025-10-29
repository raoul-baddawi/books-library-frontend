import { EnhancedTableSorting } from '$/features/shared/tables/enhanced-table'
import { apiClient } from '$/lib/utils/apiClient'
import { Pagination } from '$/lib/utils/types'

import { ExampleTableFiltersType, ExampleTableResponseType } from './types'

const baseUrl = 'repair-applications'

export const getAllExamples = async (
  filters?: ExampleTableFiltersType,
  pagination?: Pagination,
  sorting?: EnhancedTableSorting<ExampleTableResponseType>,
): Promise<ExampleTableResponseType> => {
  console.log({
    filters,
    pagination,
    sorting,
    baseUrl,
    apiClient,
  })
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        count: 3,
        data: Array.from({ length: 3 }, (_, index) => ({
          id: index + 1,
          firstName: `FirstName${index + 1}`,
          lastName: `LastName${index + 1}`,
          email: `user${index + 1}@example.com`,
          createdAt: new Date().toISOString(),
        })),
      })
    }, 1000)
  })
  //   return await apiClient
  //     .post(`${baseUrl}/get-all`, {
  //       json: { filters, pagination, sorting },
  //     })
  //     .json();
}
