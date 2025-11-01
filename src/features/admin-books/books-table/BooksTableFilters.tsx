import {
  useEnhancedTable,
  EnhancedTableSearchFilter,
} from '$/features/shared/tables/enhanced-table'
import EnhancedTableComboSelect from '$/features/shared/tables/enhanced-table/EnhancedTableComboSelect'
import { PlusCircle, RotateCcwIcon } from 'lucide-react'
import { useState } from 'react'
import {
  BookTableFiltersType,
  BookTableResponseType,
  BookTableType,
} from './types'
import LinkButton from '$/lib/components/ui/buttons/LinkButton'
import {
  useAuthorsOptions,
  useGenreOptions,
} from '$/lib/api-hooks/api-select-options'

export default function BookTableFilters() {
  const { data: authorOptions } = useAuthorsOptions()
  const { data: genreOptions } = useGenreOptions()
  const [key, setKey] = useState(0)
  const { resetFilters } = useEnhancedTable<
    BookTableResponseType,
    BookTableType,
    BookTableFiltersType
  >()

  const handleResetFilters = () => {
    resetFilters()
    setKey((prev) => prev + 1)
  }
  return (
    <div className="flex flex-col gap-2">
      <div className="flex sm:items-center gap-2 justify-between w-full flex-col sm:flex-row">
        <h1 className="font-semibold text-2xl">Books</h1>
        <LinkButton
          to="/book/create"
          variant="btn-primary"
          className="text-white!"
        >
          <PlusCircle />
          Create Book
        </LinkButton>
      </div>
      <div
        className="z-51 flex flex-wrap justify-between gap-2.5 bg-white p-3 rounded-2xl shadow-sm"
        key={key}
      >
        <div className="w-full sm:w-fit!">
          <EnhancedTableSearchFilter placeHolder="Search by name or description." />
        </div>
        <div className="flex min-h-11 grow flex-wrap items-center justify-end gap-2 xl:flex-nowrap">
          {genreOptions && genreOptions?.length > 0 && (
            <EnhancedTableComboSelect
              initialOptions={genreOptions}
              name="genre"
              multiple
              autoComplete
              placeHolder="Genre"
            />
          )}
          {authorOptions && authorOptions?.length > 0 && (
            <EnhancedTableComboSelect
              initialOptions={authorOptions}
              name="author"
              multiple
              autoComplete
              placeHolder="Author"
            />
          )}
          <button
            onClick={handleResetFilters}
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg border border-neutral-light hover:border-red hover:bg-red-light"
          >
            <RotateCcwIcon size={20} color="red" />
          </button>
        </div>
      </div>
    </div>
  )
}
