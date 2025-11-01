import { useGenreOptions } from '$/lib/api-hooks/api-select-options'
import { OptionValueType } from '$/lib/components/ui/inputs/ComboSelectInput'
import useMemoizedDebounce from '$/lib/hooks/useMemoizedDebounce'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Book } from './LandingPage'
import { apiClient } from '$/lib/utils/apiClient'

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
  return apiClient
    .get<Promise<Book[]>>('books', {
      searchParams: {
        page,
        limit: BOOKS_LIMIT,
        genre: genre.length ? genre.join(',') : undefined,
        search: search.trim() || undefined,
      },
    })
    .json()
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
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === BOOKS_LIMIT ? allPages.length + 1 : undefined,
    refetchOnWindowFocus: false,
    initialPageParam: 1,
  })

  return {
    ...infniteQuery,
    data: infniteQuery.data?.pages.flat() ?? [],
    genre,
    setGenre,
    search,
    setSearch,
    filterGenreOptions,
    isGenrePending,
  }
}
