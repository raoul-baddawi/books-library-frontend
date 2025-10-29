import type { PropsWithChildren } from 'react'
import { useEffect } from 'react'
import { useRouter } from '@tanstack/react-router'

import Sidebar from '$/lib/components/Sidebar'
import { useAuth, UserRoleEnum } from '$/lib/providers/AuthProvider'

export default function PrivateLayout({ children }: PropsWithChildren) {
  const { user, role, isFetching } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isFetching) return
    if (!user) {
      router.navigate({ to: '/login' })
      return
    }

    if (role !== UserRoleEnum.ADMIN && role !== UserRoleEnum.AUTHOR) {
      router.navigate({ to: '/unauthorized' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, role, isFetching])

  return (
    <div className="grid h-full grid-cols-[200px_1fr]">
      <Sidebar />
      <main className="scrollbar-stable overflow-auto col-start-2 p-4">
        {children}
      </main>
    </div>
  )
}
