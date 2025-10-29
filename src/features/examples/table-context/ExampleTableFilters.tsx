import { useEnhancedTable } from '$/features/shared/tables/enhanced-table'

import {
  ExampleTableFiltersType,
  ExampleTableResponseType,
  ExampleTableType,
} from './types'

function ExampleTableFilters() {
  const { filters, handleSetFilters } = useEnhancedTable<
    ExampleTableResponseType,
    ExampleTableType,
    ExampleTableFiltersType
  >()
  return (
    <div>
      Filters Goes here {JSON.stringify(filters)}
      <button
        onClick={() => handleSetFilters('search', `random-${Math.random()}`)}
      >
        Generate random search filter
      </button>
    </div>
  )
}

export default ExampleTableFilters
