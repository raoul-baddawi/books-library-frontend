import { useAuth } from '$/lib/providers/AuthProvider'
import { Link, useRouter } from '@tanstack/react-router'
import { CircleUser } from 'lucide-react'
import Logo from './Logo'

export default function Header() {
  const { user } = useAuth()
  const router = useRouter()

  const handlePrefetchOnHover = () => {
    if (!user) return

    const targetRoute = user.role === 'ADMIN' ? '/users' : '/books'

    router.preloadRoute({ to: targetRoute })
  }

  const firstName = user?.fullName.split(' ')[0] || ''
  const lastName = user.fullName.split(' ')[1] || ''
  const firstCharacters =
    firstName.charAt(0).toUpperCase() +
    (lastName ? lastName.charAt(0).toUpperCase() : '')

  return (
    <header className="w-full bg-[#91aaa4] p-4 text-white sticky top-0 z-50 flex items-center justify-between shadow-md">
      <Logo className="text-white!" />
      {user ? (
        <Link
          className="w-fit flex items-center gap-2 border border-white/50 px-3 py-1 rounded-full hover:bg-white/20 focus:bg-white/20 transition text-white!"
          to={user.role === 'ADMIN' ? '/users' : '/books'}
          onMouseEnter={handlePrefetchOnHover}
        >
          <CircleUser className="inline-block " />
          <span className="text-sm">{firstCharacters}</span>
        </Link>
      ) : (
        <Link
          className="w-fit flex items-center gap-2 border border-white/50 px-3 py-1 rounded-full hover:bg-white/20 focus:bg-white/20 transition text-white!"
          to="/login"
        >
          <CircleUser className="inline-block " />
          <span className="text-sm">Login</span>
        </Link>
      )}
    </header>
  )
}
