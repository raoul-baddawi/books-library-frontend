import { cn } from '$/lib/utils/styling'
import { Book } from './LandingPage'
import { Link, useRouter } from '@tanstack/react-router'
import { motion } from 'framer-motion'

const EntityBadge = ({
  label,
  className,
}: {
  label: string
  className?: string
}) => (
  <span className={cn('text-xs px-2 py-1 rounded ', className)}>{label}</span>
)

function BookCard(book: Book & { index: number }) {
  const bookIndex = book.index
  const router = useRouter()
  const delay = bookIndex * (book.index < 10 ? 0.1 : 0.03)

  const handlePrefetch = () => {
    router.preloadRoute({ to: '/book-detail/$id', params: { id: book.id } })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: delay,
        ease: 'easeInOut',
      }}
      className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col "
    >
      <Link
        key={book.id}
        to="/book-detail/$id"
        params={{ id: book.id }}
        className="h-full flex flex-col"
        onMouseEnter={handlePrefetch}
      >
        <img
          src={book.media[0] || '/placeholder-book.png'}
          alt={book.name}
          className="w-full h-40 object-cover"
          loading="lazy"
        />
        <div className="p-4 flex-1 flex flex-col h-full">
          <h2 className="text-xl font-semibold  text-[#2aaa8a] mb-1">
            {book.name}
          </h2>
          <EntityBadge
            label={book.genre.toUpperCase()}
            className="bg-gray-light text-grey border-grey/10 border mb-2 w-fit"
          />
          <p className="text-sm text-gray! mb-2 ">
            {book.description?.length > 100
              ? book.description.slice(0, 100) + '...'
              : book.description}
          </p>
          <div className="flex-1" />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500">By {book.authorName}</span>

            <EntityBadge
              label={book.isPublished ? 'Published' : 'Draft'}
              className={
                book.isPublished
                  ? 'bg-green/10 text-green'
                  : 'bg-red/10 text-red'
              }
            />
          </div>
          <div className="mt-2 text-xs text-gray/65">
            {book.publishedAt
              ? new Date(book.publishedAt).toLocaleDateString()
              : 'Unpublished'}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default BookCard
