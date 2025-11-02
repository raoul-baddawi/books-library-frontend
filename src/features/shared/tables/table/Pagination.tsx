import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import { useMemo } from 'react'

import { cn } from '$/lib/utils/styling'

type PaginationProps = {
  totalNumberOfPages: number
  currentPage: number
  pageLimit: number
  isPendingData: boolean
  onNextClick: () => void
  onPreviousClick: () => void
  onSetPageNumber: (pageNb: number) => void
  onSetPageLimit: (limit: number) => void
}

type PageItem = number | 'ellipsis'

const ELLIPSIS = 'ellipsis' as const

const generatePageNumbers = (
  currentPage: number,
  totalNumberOfPages: number,
): PageItem[] => {
  if (totalNumberOfPages <= 7) {
    return Array.from({ length: totalNumberOfPages }, (_, i) => i + 1)
  }

  const pages: PageItem[] = [1]

  let startPage = Math.max(2, currentPage - 1)
  let endPage = Math.min(totalNumberOfPages - 1, currentPage + 1)

  if (currentPage <= 3) {
    endPage = 4
  } else if (currentPage >= totalNumberOfPages - 2) {
    startPage = totalNumberOfPages - 3
  }

  if (startPage > 2) {
    pages.push(ELLIPSIS)
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  if (endPage < totalNumberOfPages - 1) {
    pages.push(ELLIPSIS)
  }

  if (totalNumberOfPages > 1) {
    pages.push(totalNumberOfPages)
  }

  return pages
}

const baseButtonClassName =
  'grid aspect-square w-6 h-6 text-[10px] cursor-pointer place-items-center rounded-lg font-medium transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed!'

const navigationButtonClassName = cn(
  baseButtonClassName,
  'bg-gray/10 hover:bg-gray/20 border border-gray/50',
)

const pageButtonClassName = cn(
  baseButtonClassName,
  'hover:bg-primary/15 border border-transparent',
)

const currentPageButtonClassName = cn(
  baseButtonClassName,
  'bg-primary/25 text-primary border border-primary/30 cursor-default',
)

// interface PageInputProps {
//   totalPages: number
//   onPageSubmit: (page: number) => void
//   disabled?: boolean
// }

// function PageInput({ totalPages, onPageSubmit, disabled }: PageInputProps) {
//   const [inputValue, setInputValue] = useState('')

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     const page = parseInt(inputValue)
//     if (page >= 1 && page <= totalPages) {
//       onPageSubmit(page)
//       setInputValue('')
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit} className="flex items-center gap-2">
//       <input
//         type="number"
//         min="1"
//         max={totalPages}
//         value={inputValue}
//         onChange={(e) => setInputValue(e.target.value)}
//         placeholder="Page"
//         disabled={disabled}
//         className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-40"
//       />
//       <button
//         type="submit"
//         disabled={disabled || !inputValue}
//         className="px-2 py-1 text-sm bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 disabled:opacity-40"
//       >
//         Go
//       </button>
//     </form>
//   )
// }

// interface PageLimitSelectProps {
//   currentLimit: number
//   onLimitChange: (limit: number) => void
//   disabled?: boolean
//   options?: number[]
// }

// function PageLimitSelect({
//   currentLimit,
//   onLimitChange,
//   disabled,
//   options = [10, 25, 50],
// }: PageLimitSelectProps) {
//   return (
//     <select
//       value={currentLimit}
//       onChange={(e) => onLimitChange(Number(e.target.value))}
//       disabled={disabled}
//       className="px-2 py-1 text-sm border border-gray/50 rounded focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-40 disabled:cursor-not-allowed!"
//     >
//       {options.map((limit) => (
//         <option key={limit} value={limit}>
//           {limit} per page
//         </option>
//       ))}
//     </select>
//   )
// }

export default function Pagination({
  totalNumberOfPages,
  currentPage,
  // pageLimit,
  isPendingData,
  onNextClick,
  onPreviousClick,
  onSetPageNumber,
  // onSetPageLimit,
}: PaginationProps) {
  const pageNumbers = useMemo(
    () => generatePageNumbers(currentPage, totalNumberOfPages),
    [currentPage, totalNumberOfPages],
  )

  const isFirstPage = currentPage === 1
  const isLastPage = currentPage === totalNumberOfPages

  const handleFirstPage = () => onSetPageNumber(1)
  const handleLastPage = () => onSetPageNumber(totalNumberOfPages)

  if (totalNumberOfPages <= 1) {
    return null
  }

  return (
    <div className="flex flex-col gap-4 p-1 sm:flex-row sm:items-center sm:justify-between">
      {/* Pagination controls */}
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        {/* Page input for direct navigation */}
        {/* <PageInput
          totalPages={totalNumberOfPages}
          onPageSubmit={onSetPageNumber}
          disabled={isPendingData}
        /> */}

        {/* Pagination buttons */}
        <div className="flex items-center gap-1">
          {/* First page button */}
          <button
            type="button"
            className={navigationButtonClassName}
            disabled={isFirstPage || isPendingData}
            onClick={handleFirstPage}
            aria-label="First page"
          >
            <ChevronsLeft size={16} />
          </button>

          {/* Previous page button */}
          <button
            type="button"
            className={navigationButtonClassName}
            disabled={isFirstPage || isPendingData}
            onClick={onPreviousClick}
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Page numbers */}
          {pageNumbers.map((pageNumber, index) => {
            const isEllipsis = pageNumber === ELLIPSIS
            const isCurrentPage = pageNumber === currentPage

            if (isEllipsis) {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="grid aspect-square w-6 h-6 place-items-center text-gray"
                >
                  ...
                </span>
              )
            }

            return (
              <button
                key={pageNumber}
                type="button"
                disabled={isPendingData || isCurrentPage}
                onClick={() => onSetPageNumber(pageNumber)}
                className={
                  isCurrentPage
                    ? currentPageButtonClassName
                    : pageButtonClassName
                }
                aria-label={`Page ${pageNumber}`}
                aria-current={isCurrentPage ? 'page' : undefined}
              >
                {pageNumber}
              </button>
            )
          })}

          {/* Next page button */}
          <button
            type="button"
            className={navigationButtonClassName}
            disabled={isLastPage || isPendingData}
            onClick={onNextClick}
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </button>

          {/* Last page button */}
          <button
            type="button"
            className={navigationButtonClassName}
            disabled={isLastPage || isPendingData}
            onClick={handleLastPage}
            aria-label="Last page"
          >
            <ChevronsRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
