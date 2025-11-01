import { useRouter } from '@tanstack/react-router'
import { Menu } from 'lucide-react'
import type { PropsWithChildren } from 'react'
import { useEffect, useState } from 'react'

import Sidebar from '$/lib/components/Sidebar'
import { useAuth, UserRoleEnum } from '$/lib/providers/AuthProvider'

export default function PrivateLayout({ children }: PropsWithChildren) {
  const { user, role, isFetching } = useAuth()
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

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
    <div className="grid h-full grid-cols-1 md:grid-cols-[200px_1fr]">
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 right-4 z-60 p-2 rounded-md bg-primary text-white md:hidden hover:bg-primary/80 transition-colors"
        aria-label="Toggle sidebar"
      >
        <Menu className="h-6 w-6" />
      </button>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-200 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="scrollbar-stable md:col-start-2 p-4 grid grid-cols-1 grid-rows-1 h-screen">
        {children}
      </main>
    </div>
  )
}
