import { useAuth } from '$/lib/providers/AuthProvider'
import { Link } from '@tanstack/react-router'
import { CircleUser } from 'lucide-react'
import Logo from './Logo'

export default function Header() {
  const { user } = useAuth()
  return (
    <header className="w-full bg-[#91aaa4] p-4 text-white sticky top-0 z-50 flex items-center justify-between shadow-md">
      <Logo className="text-white!" />
      {user ? (
        <Link
          className="w-fit flex items-center gap-2 border border-white/50 px-3 py-1 rounded-full hover:bg-white/20 focus:bg-white/20 transition text-white!"
          to={user.role === 'ADMIN' ? '/users' : '/books'}
        >
          <CircleUser className="inline-block " />
          <span className="text-sm">{user.fullName}</span>
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
