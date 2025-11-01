import { createFileRoute, useParams } from '@tanstack/react-router'

import BookDetailPage from '$/features/landing/BookDetailPage'
import { Book } from '$/features/landing/LandingPage'
import PublicLayout from '$/lib/layouts/PublicLayout'
import { apiClient } from '$/lib/utils/apiClient'

export const Route = createFileRoute('/book-detail/$id')({
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData({
      queryKey: ['book-public-detail', params.id],
      queryFn: async () =>
        await apiClient.get<Book>(`books/${params.id}`).json(),
    })
  },
  component: BookDetail,
})

function BookDetail() {
  const { id } = useParams({ from: '/book-detail/$id' })

  return (
    <PublicLayout>
      <BookDetailPage bookId={id} />
    </PublicLayout>
  )
}
