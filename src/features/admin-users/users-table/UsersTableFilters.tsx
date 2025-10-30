import { useEnhancedTable } from '$/features/shared/tables/enhanced-table'

import {
  UserTableFiltersType,
  UserTableResponseType,
  UserTableType,
} from './types'

function UserTableFilters() {
  const { filters, handleSetFilters } = useEnhancedTable<
    UserTableResponseType,
    UserTableType,
    UserTableFiltersType
  >()
  return (
    <div className="flex h-fit">
      Filters Goes here {JSON.stringify(filters)}
      <button
        onClick={() => handleSetFilters('search', `random-${Math.random()}`)}
      >
        Generate random search filter
      </button>
    </div>
  )
}

export default UserTableFilters
