import { ArrowLeft, Calendar, User } from 'lucide-react'
import { useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import useApiQuery from '$/lib/hooks/useApiQuery'
import { Book } from './LandingPage'
import { apiClient } from '$/lib/utils/apiClient'
import { cn } from '$/lib/utils/styling'
import PageLoader from '$/lib/components/loaders/PgaeLoader'

interface BookDetailPageProps {
  bookId: string
}

export default function BookDetailPage({ bookId }: BookDetailPageProps) {
  const router = useRouter()
  const [activeMediaIndex, setActiveMediaIndex] = useState(0)

  const { data: book, isLoading } = useApiQuery({
    queryKey: ['book-public-detail', bookId],
    queryFn: async () => await apiClient.get<Book>(`books/${bookId}`).json(),
  })

  if (isLoading) {
    return <PageLoader />
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray mb-4">Book not found</h2>
          <button
            onClick={() => router.history.back()}
            className="text-primary hover:underline"
          >
            Go back
          </button>
        </div>
      </div>
    )
  }

  const hasMedia = book.media && book.media.length > 0

  return (
    <div className="min-h-screen bg-white/60">
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <button
          onClick={() => router.history.back()}
          className="flex items-center gap-2 text-gray hover:text-primary transition-colors group"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back</span>
        </button>
      </div>

      {hasMedia && (
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="relative aspect-video bg-gray/20">
              <img
                src={book.media[activeMediaIndex]}
                alt={`${book.name} - Image ${activeMediaIndex + 1}`}
                className="w-full h-full object-cover"
              />

              {book.media.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setActiveMediaIndex((prev) =>
                        prev === 0 ? book.media.length - 1 : prev - 1,
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
                  >
                    <ArrowLeft className="h-6 w-6 text-gray" />
                  </button>
                  <button
                    onClick={() =>
                      setActiveMediaIndex((prev) =>
                        prev === book.media.length - 1 ? 0 : prev + 1,
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
                  >
                    <ArrowLeft className="h-6 w-6 text-gray rotate-180" />
                  </button>
                </>
              )}

              {book.media.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                  {activeMediaIndex + 1} / {book.media.length}
                </div>
              )}
            </div>

            {book.media.length > 1 && (
              <div className="p-4 bg-gray/20 flex gap-2 overflow-x-auto">
                {book.media.map((media, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveMediaIndex(index)}
                    className={cn(
                      'shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all hover:scale-105',
                      activeMediaIndex === index
                        ? 'border-primary ring-2 ring-primary/30'
                        : 'border-gray/25 hover:border-gray/40',
                    )}
                  >
                    <img
                      src={media}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Book Details Section */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-12">
          {/* Genre Badge */}
          <div className="mb-4">
            <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold">
              {book.genre}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-bold text-gray mb-6">
            {book.name}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap gap-6 mb-8 text-gray/80">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <span className="font-medium">by {book.authorName}</span>
            </div>
            {book.publishedAt && (
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span>
                  Published on{' '}
                  {new Date(book.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            )}
          </div>

          {/* Publication Status */}
          <div className="mb-8">
            <div
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium',
                book.isPublished
                  ? 'bg-primary-light text-primary'
                  : 'bg-yellow-light text-yellow',
              )}
            >
              <div
                className={cn(
                  'h-2 w-2 rounded-full',
                  book.isPublished ? 'bg-green/65' : 'bg-yellow/65',
                )}
              />
              {book.isPublished ? 'Published' : 'Draft'}
            </div>
          </div>

          {/* Description */}
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray mb-4">
              About this book
            </h2>
            <p className="text-gray/90 leading-relaxed whitespace-pre-wrap">
              {book.description}
            </p>
          </div>

          {/* Placeholder for no media */}
          {!hasMedia && (
            <div className="mt-8 aspect-video bg-linear-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">📚</div>
                <p className="text-gray/75 font-medium">No images available</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
