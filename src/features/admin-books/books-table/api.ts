import { EnhancedTableSorting } from '$/features/shared/tables/enhanced-table'
import { apiClient } from '$/lib/utils/apiClient'
import { Pagination } from '$/lib/utils/types'

import {
  BookTableFiltersType,
  BookTableResponseType,
  BookTableType,
} from './types'

const baseUrl = 'books'

export const getAllBooks = async (
  filters?: BookTableFiltersType,
  pagination?: Pagination,
  sorting?: EnhancedTableSorting<BookTableType>,
): Promise<BookTableResponseType> => {
  return await apiClient
    .post(`${baseUrl}/get-all`, {
      json: { filters, pagination, sorting },
    })
    .json()
}
