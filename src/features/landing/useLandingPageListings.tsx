import { useInfiniteQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { useGenreOptions } from '$/lib/api-hooks/api-select-options'
import { OptionValueType } from '$/lib/components/ui/inputs/ComboSelectInput'
import useMemoizedDebounce from '$/lib/hooks/useMemoizedDebounce'
import { apiClient } from '$/lib/utils/apiClient'

import { Book } from './LandingPage'

const BOOKS_LIMIT = 10

async function fetchBooks({
  page = 1,
  genre = [],
  search = '',
}: {
  page?: number
  genre: OptionValueType[]
  search?: string
}): Promise<Book[]> {
  try {
    const result = await apiClient
      .get<Book[]>('books', {
        searchParams: {
          page,
          limit: BOOKS_LIMIT,
          genre: genre?.length ? genre.join(',') : undefined,
          search: search?.trim() || undefined,
        },
      })
      .json()
    return result || []
  } catch {
    return []
  }
}

export default function useLandingPageListings() {
  const { data: filterGenreOptions, isPending: isGenrePending } =
    useGenreOptions()

  const [genre, setGenre] = useState<OptionValueType[]>([])
  const [search, setSearch] = useState<string>('')
  const debouncedSearchText = useMemoizedDebounce(search, 500)
  const infniteQuery = useInfiniteQuery<Book[], Error>({
    queryKey: ['books', genre, debouncedSearchText],
    queryFn: ({ pageParam = 1 }) =>
      fetchBooks({
        page: pageParam as number,
        genre,
        search: debouncedSearchText,
      }),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || !Array.isArray(lastPage) || !allPages) return undefined
      return lastPage?.length === BOOKS_LIMIT ? allPages?.length + 1 : undefined
    },
    refetchOnWindowFocus: false,
    initialPageParam: 1,
    retry: 1,
  })

  return {
    infniteQueryData: infniteQuery,
    genre,
    setGenre,
    search,
    setSearch,
    filterGenreOptions,
    isGenrePending,
  }
}
