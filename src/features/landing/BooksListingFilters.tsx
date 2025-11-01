import React from 'react'

import ComboSelect from '$/lib/components/ui/inputs/ComboSelectInput'
import Label from '$/lib/components/ui/inputs/Label'
import TextInput from '$/lib/components/ui/inputs/TextInput'

type Props = {
  search: string
  handleOnSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  genre: (string | number)[]
  isGenrePending: boolean
  filterGenreOptions: { label: string; value: string | number }[] | undefined
  setGenre: (genre: (string | number)[]) => void
}

function BooksListingFilters({
  genre,
  handleOnSearchChange,
  search,
  filterGenreOptions,
  isGenrePending,
  setGenre,
}: Props) {
  return (
    <div className="flex gap-4 mb-6 flex-wrap">
      <div className="grow flex-1 min-w-52">
        <Label htmlFor="search">Search Books</Label>
        <TextInput
          id="search"
          value={search}
          onChange={handleOnSearchChange}
          placeholder="Search by name or description"
        />
      </div>
      <div className="flex justify-center grow flex-1 min-w-52 flex-col">
        <Label htmlFor="genre">Filter by genre</Label>
        <ComboSelect
          id="genre"
          name="genre"
          autoComplete
          autoAddOptions
          showSelectedOptions
          multiple
          disabled={isGenrePending || !filterGenreOptions?.length}
          value={genre}
          options={filterGenreOptions || []}
          onChange={(v) => {
            if (Array.isArray(v)) setGenre(v)
          }}
        />
      </div>
    </div>
  )
}

export default BooksListingFilters
