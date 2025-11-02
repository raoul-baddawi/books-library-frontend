import { createFileRoute, useParams } from '@tanstack/react-router'
import { useEffect } from 'react'

import BookDetailPage from '$/features/landing/BookDetailPage'
import { Book } from '$/features/landing/LandingPage'
import useApiQuery from '$/lib/hooks/useApiQuery'
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

  const { data: book } = useApiQuery({
    queryKey: ['book-public-detail', id],
    queryFn: async () => await apiClient.get<Book>(`books/${id}`).json(),
  })

  useEffect(() => {
    if (!book) return

    const { name, description, media } = book
    const ogImage = media?.[0] || ''
    const ogDescription =
      description.slice(0, 50) + (description.length > 50 ? '...' : '')

    // Update title
    document.title = name

    // Helper to update or create meta tag
    const updateMetaTag = (selector: string, content: string) => {
      let meta = document.querySelector(selector)
      if (!meta) {
        meta = document.createElement('meta')
        const attr = selector.includes('property') ? 'property' : 'name'
        const value = selector.match(/["']([^"']+)["']/)?.[1] || ''
        meta.setAttribute(attr, value)
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', content)
    }

    // Update all meta tags
    updateMetaTag('meta[name="description"]', ogDescription)
    updateMetaTag('meta[property="og:title"]', name)
    updateMetaTag('meta[property="og:description"]', ogDescription)
    updateMetaTag('meta[property="og:image"]', ogImage)
    updateMetaTag('meta[property="og:type"]', 'book')
    updateMetaTag('meta[name="twitter:card"]', 'summary_large_image')
    updateMetaTag('meta[name="twitter:title"]', name)
    updateMetaTag('meta[name="twitter:description"]', ogDescription)
    updateMetaTag('meta[name="twitter:image"]', ogImage)

    // Cleanup on unmount
    return () => {
      document.title = 'Books Library'
    }
  }, [book])

  return (
    <PublicLayout>
      <BookDetailPage bookId={id} />
    </PublicLayout>
  )
}
