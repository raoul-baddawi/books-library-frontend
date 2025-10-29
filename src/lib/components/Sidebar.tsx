import { BookOpen, Home, LogOut, User } from 'lucide-react'
import { useRouter } from '@tanstack/react-router'
import { useAuth } from '$/lib/providers/AuthProvider'
import { cn } from '../utils/styling'

export default function Sidebar() {
  const { clearUser, role } = useAuth()
  const router = useRouter()

  const common = [{ label: 'Home', to: '/', icon: Home }]
  const authorLinks = [{ label: 'Books', to: '/books', icon: BookOpen }]
  const adminLinks = [
    { label: 'Users', to: '/users', icon: User },
    { label: 'Books', to: '/books', icon: BookOpen },
  ]
  const items = [
    ...common,
    ...(role === 'ADMIN' ? adminLinks : []),
    ...(role === 'AUTHOR' ? authorLinks : []),
  ]

  return (
    <aside className="flex flex-col fixed z-54 row-span-2 row-start-1 h-full w-[200px] transform rounded-lg border border-border bg-white p-4 transition-transform duration-300 ease-in-out">
      <div className="mb-3 text-lg font-semibold text-center">Library</div>
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
              onClick={() => (router as any).navigate({ to: item.to })}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          )
        })}
        <button
          className="mt-auto flex w-full items-center gap-2 rounded-md px-3 py-2 text-left hover:bg-primary/35"
          onClick={() => {
            clearUser()
            ;(router as any).navigate({ to: '/' })
          }}
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  )
}
