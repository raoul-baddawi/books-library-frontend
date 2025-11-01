import { cn } from '$/lib/utils/styling'
import { Link, useRouter } from '@tanstack/react-router'
import { LucideLibraryBig } from 'lucide-react'

function Logo({ className }: { className?: string }) {
  const router = useRouter()
  const handlePrefetchHome = () => {
    router.preloadRoute({ to: '/' })
  }
  return (
    <Link
      className={cn('sm:text-2xl font-semibold  flex items-center', className)}
      to="/"
      onMouseEnter={handlePrefetchHome}
    >
      <LucideLibraryBig size={30} className="inline-block mr-2" />
      Books Library
    </Link>
  )
}

export default Logo
