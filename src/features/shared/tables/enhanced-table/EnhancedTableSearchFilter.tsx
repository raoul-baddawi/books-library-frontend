import { SearchIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

import useMemoizedDebounce from '$/lib/hooks/useMemoizedDebounce'
import { cn } from '$/lib/utils/styling'

import { useEnhancedTable } from './EnhancedTableProvider'

type EnhancedTableSearchFilterProps = {
  placeHolder?: string
  className?: string
}

export default function EnhancedTableSearchFilter<
  TFilters extends { search: string },
>({ placeHolder = 'Chercher', className }: EnhancedTableSearchFilterProps) {
  const [searchText, setSearchText] = useState('')
  const { handleSetFilters } = useEnhancedTable<unknown, unknown, TFilters>()

  const debouncedSearchText = useMemoizedDebounce(searchText)

  useEffect(() => {
    handleSetFilters('search', debouncedSearchText)
  }, [debouncedSearchText, handleSetFilters])

  return (
    <div
      className={cn(
        'relative flex h-11 w-full shrink-0 items-center gap-2 rounded-lg border border-neutral-light p-3 pr-0! text-sm text-neutral-medium focus-within:border-primary focus-within:ring-2 focus-within:ring-primary-light sm:w-[290px]',
        className,
      )}
    >
      <SearchIcon size={17} />
      <input
        type="text"
        placeholder={placeHolder}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="w-full pr-4 text-sm ring-0 outline-none placeholder:text-sm focus:ring-0 focus:outline-none"
      />
    </div>
  )
}
