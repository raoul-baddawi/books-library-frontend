import { createFileRoute } from '@tanstack/react-router'
import PublicLayout from '$/lib/layouts/PublicLayout'
import LandingPage from '$/features/landing/LandingPage'
import { apiClient } from '$/lib/utils/apiClient'

export const Route = createFileRoute('/')({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData({
      queryKey: ['genre-options'],
      queryFn: async () => await apiClient.get('books/genre-options').json(),
    })

    await context.queryClient.prefetchInfiniteQuery({
      queryKey: ['books', [], ''],
      queryFn: async ({ pageParam = 1 }) => {
        const result = await apiClient
          .get('books', {
            searchParams: {
              page: pageParam as number,
              limit: 10,
            },
          })
          .json()
        return result || []
      },
      initialPageParam: 1,
    })
  },
  component: Home,
})

function Home() {
  return (
    <PublicLayout>
      <LandingPage />
    </PublicLayout>
  )
}
