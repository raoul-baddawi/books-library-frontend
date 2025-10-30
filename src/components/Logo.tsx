import { cn } from '$/lib/utils/styling'
import { Link } from '@tanstack/react-router'
import { LucideLibraryBig } from 'lucide-react'

function Logo({ className }: { className?: string }) {
  return (
    <Link
      className={cn('text-2xl font-semibold  flex items-center', className)}
      to="/"
    >
      <LucideLibraryBig size={30} className="inline-block mr-2" />
      Books Library
    </Link>
  )
}

export default Logo
