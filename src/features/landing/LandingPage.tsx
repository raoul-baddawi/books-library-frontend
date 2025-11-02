import { useEffect, useRef } from 'react'

import BookCard from './BookCard'
import BooksListingFilters from './BooksListingFilters'
import BooksLoader from './BooksLoader'
import useLandingPageListings from './useLandingPageListings'

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

export default function LandingPage() {
  const {
    infniteQueryData: {
      isLoading,
      isError,
      fetchNextPage,
      isFetchingNextPage,
      hasNextPage,
      refetch,
      data,
    },
    genre,
    setGenre,
    search,
    setSearch,
    filterGenreOptions,
    isGenrePending,
  } = useLandingPageListings()

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

    const currentLoader = loaderRef.current
    if (currentLoader) observer.observe(currentLoader)
    return () => {
      if (currentLoader) observer.unobserve(currentLoader)
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  useEffect(() => {
    refetch()
  }, [genre, refetch])

  const books: Book[] = data?.pages?.flat() || []

  return (
    <div className="min-h-screen pb-20 px-5">
      <div className="max-w-5xl mx-auto py-10">
        <h1 className="text-4xl font-bold text-center mb-8 text-[#2aaa8a] drop-shadow-lg">
          Welcome to the Book Library
        </h1>
        <BooksListingFilters
          genre={genre}
          setGenre={setGenre}
          search={search}
          handleOnSearchChange={handleOnSearchChange}
          filterGenreOptions={filterGenreOptions}
          isGenrePending={isGenrePending}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {books?.map((book, index) => (
            <BookCard key={book.id} {...book} index={index} />
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
