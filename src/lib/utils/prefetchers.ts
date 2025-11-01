import { QueryClient } from '@tanstack/react-query'
import { redirect } from '@tanstack/react-router'
import { apiClient } from './apiClient'
import { AuthUser } from '../providers/AuthProvider'

export async function ensureAuthenticated(queryClient: QueryClient) {
  const user = await queryClient.ensureQueryData({
    queryKey: ['user'],
    queryFn: () => apiClient.get<AuthUser>('auth/me').json(),
  })

  if (!user) {
    throw redirect({ to: '/login' })
  }

  return user
}

export async function ensureAdmin(queryClient: QueryClient) {
  const user = await ensureAuthenticated(queryClient)

  if (user.role !== 'ADMIN') {
    throw redirect({ to: '/unauthorized' })
  }

  return user
}

export async function ensureAdminOrAuthor(queryClient: QueryClient) {
  const user = await ensureAuthenticated(queryClient)

  if (user.role !== 'ADMIN' && user.role !== 'AUTHOR') {
    throw redirect({ to: '/unauthorized' })
  }

  return user
}
