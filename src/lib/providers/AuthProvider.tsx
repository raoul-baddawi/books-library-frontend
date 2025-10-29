/* eslint-disable react-refresh/only-export-components */
import { useQueryClient } from '@tanstack/react-query'
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useState,
} from 'react'

import useApiQuery from '../hooks/useApiQuery'

export const UserRoleEnum = {
  ADMIN: 'ADMIN',
  USER: 'USER',
  AUTHOR: 'AUTHOR',
} as const

export type UserRoleType = (typeof UserRoleEnum)[keyof typeof UserRoleEnum]

export type AuthUser = {
  id: string
  username: string
  role: UserRoleType
  books: {
    id: string
    name: string
    description: string
    isPublished: boolean
  }[]
}

export type AuthContextType = {
  user: AuthUser | null
  role: UserRoleType | null
  isFetching: boolean
  status: 'pending' | 'error' | 'success'
  setUser: (user: AuthUser) => void
  invalidateUser: (fetchingStateVisible?: boolean) => Promise<void>
  clearUser: () => void
}

type VerifiedAuthContext = {
  user: AuthUser
  role: UserRoleType
  isFetching: boolean
  status: 'success'
  setUser: (user: AuthUser) => void
  invalidateUser: (fetchingStateVisible?: boolean) => Promise<void>
  clearUser: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export default function AuthProvider({ children }: PropsWithChildren) {
  const [showFetchingState, setShowFetchingState] = useState(true)

  const queryClient = useQueryClient()

  const {
    data: user,
    isFetching,
    status,
  } = useApiQuery({
    queryKey: ['user'],
    queryFn: ({ apiClient }) => apiClient.get<AuthUser>('auth/me').json(),
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  const setUser = (data: AuthUser) => {
    queryClient.setQueryData(['user'], data)
  }

  const invalidateUser = async (fetchingStateVisible?: boolean) => {
    setShowFetchingState(!!fetchingStateVisible)
    await queryClient.invalidateQueries({
      queryKey: ['user'],
    })
    setShowFetchingState(true)
  }

  const clearUser = () => {
    queryClient.setQueryData(['user'], null)
  }

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        role: user?.role ?? null,
        isFetching: isFetching && showFetchingState,
        status,
        setUser,
        clearUser,
        invalidateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth<Unverified extends boolean = false>() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context as Unverified extends true
    ? AuthContextType
    : VerifiedAuthContext
}
