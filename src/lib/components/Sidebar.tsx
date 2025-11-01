import { BookOpen, LogOut, User } from 'lucide-react'
import { useRouter } from '@tanstack/react-router'
import { useAuth } from '$/lib/providers/AuthProvider'
import { cn } from '../utils/styling'
import Button from './ui/buttons/Button'
import Logo from '$/components/Logo'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { clearUser, isPendingLogout, role } = useAuth()
  const router = useRouter()

  const authorLinks = [{ label: 'Books', to: '/books', icon: BookOpen }]
  const adminLinks = [
    { label: 'Users', to: '/users', icon: User },
    { label: 'Books', to: '/books', icon: BookOpen },
  ]

  const items = [
    ...(role === 'ADMIN' ? adminLinks : []),
    ...(role === 'AUTHOR' ? authorLinks : []),
  ]

  const handleNavigate = (to: string) => {
    router.navigate({ to })
    onClose()
  }

  const handlePrefetchOnHover = (to: string) => {
    router.preloadRoute({ to })
  }

  return (
    <aside
      className={cn(
        'flex flex-col fixed z-201 md:z-54 row-span-2 row-start-1 h-full w-[200px] rounded-lg border border-border bg-white p-4 transition-transform duration-300 ease-in-out',
        'md:translate-x-0',
        isOpen ? 'translate-x-0' : '-translate-x-full',
      )}
    >
      <div className="mb-3 text-lg font-semibold text-center">
        <Logo className="text-xl flex flex-col items-center" />
      </div>
      <nav className="flex flex-col gap-2 h-full">
        {items.map((item) => {
          const isActive = router.state.location.pathname === item.to
          return (
            <button
              key={item.to}
              className={cn(
                'flex items-center gap-2 rounded-md px-3 py-2 text-left hover:bg-primary/35',
                isActive &&
                  'bg-primary text-white font-medium hover:bg-primary/75',
              )}
              onClick={() => handleNavigate(item.to)}
              onMouseEnter={() => handlePrefetchOnHover(item.to)}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          )
        })}
        <Button
          isLoading={isPendingLogout}
          disabled={isPendingLogout}
          variant="btn-white"
          className="mt-auto flex w-full!  gap-2 rounded-md px-3 py-2 text-left hover:bg-primary/35"
          onClick={() => {
            clearUser()
            router.navigate({ to: '/' })
            onClose()
          }}
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </nav>
    </aside>
  )
}
