import { createFileRoute, Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'

export const Route = createFileRoute('/not-found')({
  component: NotFound,
})

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-950 via-indigo-950 to-slate-950">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-white"
      >
        <p className="text-8xl mb-4">🌟</p>
        <h1 className="text-4xl font-bold mb-2">Page not found</h1>
        <p className="text-white/60 mb-8">This page doesn't exist.</p>
        <Link
          to="/"
          className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        >
          Go home
        </Link>
      </motion.div>
    </div>
  )
}
