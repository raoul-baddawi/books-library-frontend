import { useNavigate } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { useEffect } from 'react'

import { useRevealSettings } from './api'
import FloatingParticles from './FloatingParticles'
import RevealAnimation from './RevealAnimation'
import StarField from './StarField'

export default function RevealPage() {
  const navigate = useNavigate()
  const { data: settings, isPending } = useRevealSettings()

  useEffect(() => {
    if (!isPending && settings && !settings.isRevealed) {
      navigate({ to: '/' })
    }
  }, [settings, isPending, navigate])

  if (isPending) {
    return (
      <div className="gr-page flex items-center justify-center">
        <StarField count={80} />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="text-6xl relative z-10"
        >
          ✨
        </motion.div>
      </div>
    )
  }

  if (!settings?.gender) {
    return (
      <div className="gr-page flex items-center justify-center overflow-hidden">
        <StarField count={90} />
        <FloatingParticles count={12} />
        <div className="relative z-10 text-center px-6">
          <p className="text-6xl mb-5">🎁</p>
          <h1 className="text-3xl font-black mb-3" style={{ letterSpacing: '-0.02em' }}>
            The secret is safe… for now.
          </h1>
          <p className="gr-muted">The reveal hasn't happened yet. Check back soon!</p>
        </div>
      </div>
    )
  }

  return <RevealAnimation gender={settings.gender} />
}

  const navigate = useNavigate()
  const { data: settings, isPending } = useRevealSettings()

  // If reveal hasn't been triggered yet, send back to home
  useEffect(() => {
    if (!isPending && settings && !settings.isRevealed) {
      navigate({ to: '/' })
    }
  }, [settings, isPending, navigate])

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-950 via-indigo-950 to-slate-950">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="text-5xl"
        >
          ✨
        </motion.div>
      </div>
    )
  }

  if (!settings?.gender) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-linear-to-br from-purple-950 via-indigo-950 to-slate-950 text-white overflow-hidden">
        <FloatingParticles count={15} />
        <div className="relative z-10 text-center">
          <p className="text-6xl mb-4">🎁</p>
          <h1 className="text-3xl font-bold mb-2">The secret is safe… for now.</h1>
          <p className="text-white/50">The reveal hasn't happened yet. Check back soon!</p>
        </div>
      </div>
    )
  }

  return <RevealAnimation gender={settings.gender} />
}
