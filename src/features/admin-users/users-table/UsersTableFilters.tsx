import { PlusCircle, RotateCcwIcon } from 'lucide-react'
import { useState } from 'react'

import {
  EnhancedTableSearchFilter,
  useEnhancedTable,
} from '$/features/shared/tables/enhanced-table'
import EnhancedTableComboSelect from '$/features/shared/tables/enhanced-table/EnhancedTableComboSelect'
import LinkButton from '$/lib/components/ui/buttons/LinkButton'
import { USER_ROLES_SELECT_OPTIONS } from '$/lib/constants/select-options'

import {
  UserTableFiltersType,
  UserTableResponseType,
  UserTableType,
} from './types'

export default function UserTableFilters() {
  const [key, setKey] = useState(0)
  const { resetFilters } = useEnhancedTable<
    UserTableResponseType,
    UserTableType,
    UserTableFiltersType
  >()

  const handleResetFilters = () => {
    resetFilters()
    setKey((prev) => prev + 1)
  }
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 sm:items-center justify-between w-full flex-col sm:flex-row">
        <h1 className="font-semibold text-2xl">Users</h1>
        <LinkButton
          to="/user/create"
          variant="btn-primary"
          className="text-white!"
        >
          <PlusCircle />
          Create User
        </LinkButton>
      </div>
      <div
        className="z-51 flex flex-wrap justify-between gap-2.5 bg-white p-3 rounded-2xl shadow-sm"
        key={key}
      >
        <div className="w-full sm:w-fit!">
          <EnhancedTableSearchFilter placeHolder="Search by name or email." />
        </div>
        <div className="flex min-h-11 grow flex-wrap items-center justify-end gap-2 xl:flex-nowrap">
          <EnhancedTableComboSelect
            initialOptions={USER_ROLES_SELECT_OPTIONS}
            name="role"
            placeHolder="Role"
          />
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
