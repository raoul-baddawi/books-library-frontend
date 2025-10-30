import { apiClient } from '$/lib/utils/apiClient'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import BooksLoader from './BooksLoader'
import useApiQuery from '$/lib/hooks/useApiQuery'
import ComboSelect, {
  OptionValueType,
} from '$/lib/components/ui/inputs/ComboSelectInput'
import TextInput from '$/lib/components/ui/inputs/TextInput'
import { Link } from '@tanstack/react-router'
import useMemoizedDebounce from '$/lib/hooks/useMemoizedDebounce'

export type Book = {
  id: string
  name: string
  description: string
  authorName: string
  isPublished: boolean
  publishedAt?: string
  media: string[]
  genre: string
}

export type GenreOption = {
  label: string
  value: string
}

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

export default function LandingPage() {
  const { data: filterOptions, isPending } = useApiQuery({
    queryKey: ['genre-options'],
    queryFn: async ({ apiClient }) =>
      await apiClient.get<Promise<GenreOption[]>>('books/genre-options').json(),
  })

  const [genre, setGenre] = useState<OptionValueType[]>([])
  const [search, setSearch] = useState<string>('')
  const debouncedSearchText = useMemoizedDebounce(search, 500)

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isLoading,
    isError,
  } = useInfiniteQuery<Book[], Error>({
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

  const loaderRef = useRef<HTMLDivElement | null>(null)

  const handleOnSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchNextPage()
      }
    })

    if (loaderRef.current) observer.observe(loaderRef.current)
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current)
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  useEffect(() => {
    refetch()
  }, [genre, refetch])

  const books: Book[] = data?.pages.flat() ?? []

  return (
    <div className="min-h-screen pb-20 px-5">
      <div className="max-w-5xl mx-auto py-10">
        <h1 className="text-4xl font-bold text-center mb-8 text-[#2aaa8a] drop-shadow-lg">
          Welcome to the books Library
        </h1>
        <div className="flex gap-4 mb-6 flex-wrap">
          <div className="grow flex-1 min-w-52">
            <TextInput
              value={search}
              onChange={handleOnSearchChange}
              placeholder="Search by name or description"
            />
          </div>
          {filterOptions && filterOptions.length > 0 && !isPending && (
            <div className="flex justify-center grow flex-1 min-w-52">
              <ComboSelect
                autoComplete
                autoAddOptions
                showSelectedOptions
                multiple
                disabled={false}
                value={genre}
                options={filterOptions || []}
                onChange={(v) => {
                  if (Array.isArray(v)) setGenre(v)
                }}
              />
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {books.map((book) => (
            <Link
              key={book.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col hover:scale-101 transition-transform duration-200"
              to="/"
            >
              <img
                src={book.media[0]}
                alt={book.name}
                className="w-full h-40 object-cover"
                loading="lazy"
              />
              <div className="p-4 flex-1 flex flex-col">
                <h2 className="text-xl font-semibold mb-2 text-[#2aaa8a]">
                  {book.name}
                </h2>
                <p className="text-sm text-gray! mb-2 ">
                  {book.description.length > 100
                    ? book.description.slice(0, 100) + '...'
                    : book.description}
                </p>
                <div className="flex-1" />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">
                    By {book.authorName}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${book.isPublished ? 'bg-green/10 text-green' : 'bg-red/10 text-red'}`}
                  >
                    {book.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
                <div className="mt-2 text-xs text-gray/65">
                  {book.publishedAt
                    ? new Date(book.publishedAt).toLocaleDateString()
                    : 'Unpublished'}
                </div>
              </div>
            </Link>
          ))}
        </div>
        {isLoading && <BooksLoader />}
        {isError && (
          <div className="text-center py-8 text-red">Failed to load books.</div>
        )}

        <div ref={loaderRef} className="h-10" />
        {isFetchingNextPage && <BooksLoader />}
        {!hasNextPage && !isLoading && (
          <div className="text-center py-8 text-gray/60">
            No more books to show.
          </div>
        )}
      </div>
    </div>
  )
}
