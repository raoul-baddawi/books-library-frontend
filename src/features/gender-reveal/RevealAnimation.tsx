import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'

import StarField from './StarField'
import type { Gender } from './types'

type Phase =
  | 'idle'
  | 'spinning'
  | 'slowdown'
  | 'fakeout1'
  | 'fakeout2'
  | 'finalReveal'
  | 'celebration'

type Piece = {
  id: number
  x: number
  color: string
  w: number
  h: number
  delay: number
  dur: number
  rotate: number
}

function useConfetti(active: boolean, gender: Gender) {
  return useMemo<Piece[]>(() => {
    if (!active) return []
    const boyC = ['#1d4ed8', '#3b82f6', '#60a5fa', '#bfdbfe', '#fff', '#c7d2fe']
    const girlC = [
      '#be185d',
      '#ec4899',
      '#f472b6',
      '#fbcfe8',
      '#fff',
      '#fde68a',
    ]
    const cols = gender === 'BOY' ? boyC : girlC
    return Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: cols[Math.floor(Math.random() * cols.length)],
      w: 5 + Math.random() * 9,
      h: 3 + Math.random() * 5,
      delay: Math.random() * 1.2,
      dur: 2.2 + Math.random() * 2.5,
      rotate: Math.random() * 900 - 450,
    }))
  }, [active, gender])
}

const SEQ: Gender[] = [
  'BOY',
  'GIRL',
  'BOY',
  'GIRL',
  'BOY',
  'GIRL',
  'BOY',
  'GIRL',
  'BOY',
  'GIRL',
  'BOY',
  'GIRL',
  'BOY',
  'GIRL',
  'BOY',
  'GIRL',
]

interface RevealAnimationProps {
  gender: Gender
  onComplete?: () => void
}

export default function RevealAnimation({
  gender,
  onComplete,
}: RevealAnimationProps) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [spinIdx, setSpinIdx] = useState(0)
  const [display, setDisplay] = useState<Gender>('BOY')
  const [started, setStarted] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const confetti = useConfetti(phase === 'celebration', gender)

  const clearSpin = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const startSequence = () => {
    setStarted(true)
    setPhase('spinning')
    let idx = 0

    const spin = (speed: number) => {
      clearSpin()
      intervalRef.current = setInterval(() => {
        idx++
        setSpinIdx(idx)
        setDisplay(SEQ[idx % SEQ.length])
      }, speed)
    }

    spin(70) // blazing fast
    setTimeout(() => {
      setPhase('slowdown')
      spin(280)
    }, 2600) // slowdown
    const wrong: Gender = gender === 'BOY' ? 'GIRL' : 'BOY'
    setTimeout(() => {
      clearSpin()
      setPhase('fakeout1')
      setDisplay(wrong)
    }, 3700) // WRONG fake-out
    setTimeout(() => {
      setPhase('fakeout2')
      spin(110)
    }, 4600) // panic spin
    setTimeout(() => {
      clearSpin()
      setPhase('finalReveal')
      setDisplay(gender)
    }, 5500) // CORRECT
    setTimeout(() => {
      setPhase('celebration')
      onComplete?.()
    }, 6600)
  }

  useEffect(() => () => clearSpin(), [])

  /* ── Background ─────────────────────────────── */
  const pageBg =
    phase === 'celebration'
      ? gender === 'BOY'
        ? 'radial-gradient(ellipse at 50% 30%, #1d4ed8 0%, #1e3a8a 40%, #0b1120 100%)'
        : 'radial-gradient(ellipse at 50% 30%, #be185d 0%, #831843 40%, #1a0010 100%)'
      : 'radial-gradient(ellipse at 50% -10%, #4a1d96 0%, #1e1b4b 40%, #0b0920 100%)'

  /* ── Card colours ───────────────────────────── */
  const isBoy = display === 'BOY'
  const cardBg = isBoy ? 'rgba(59,130,246,0.12)' : 'rgba(236,72,153,0.12)'
  const cardBorder = isBoy ? 'rgba(59,130,246,0.55)' : 'rgba(236,72,153,0.55)'
  const cardGlow = isBoy ? 'rgba(59,130,246,0.45)' : 'rgba(236,72,153,0.45)'
  const labelColor = isBoy ? '#60a5fa' : '#f472b6'

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: pageBg,
        transition: 'background 1s ease',
        color: '#fff',
      }}
    >
      <StarField count={100} />

      {/* Confetti */}
      {phase === 'celebration' &&
        confetti.map((c) => (
          <motion.div
            key={c.id}
            className="fixed pointer-events-none"
            style={{
              left: `${c.x}%`,
              top: -16,
              width: c.w,
              height: c.h,
              backgroundColor: c.color,
              borderRadius: 2,
            }}
            animate={{
              y: ['0vh', '112vh'],
              rotate: [0, c.rotate],
              opacity: [1, 1, 0.3, 0],
            }}
            transition={{
              duration: c.dur,
              delay: c.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}

      {/* Balloons on celebrate */}
      {phase === 'celebration' &&
        Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="fixed pointer-events-none text-5xl"
            style={{ left: `${5 + i * 8}%`, bottom: -70 }}
            animate={{
              y: '-120vh',
              x: [0, i % 2 === 0 ? 40 : -40, 0],
              rotate: [0, 18, -18, 0],
            }}
            transition={{
              duration: 4.5 + Math.random(),
              delay: i * 0.12,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {gender === 'BOY' ? '💙' : '💗'}
          </motion.div>
        ))}

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        {/* Title */}
        <AnimatePresence mode="wait">
          <motion.h1
            key={phase}
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-3xl sm:text-4xl font-black mb-10"
            style={{ letterSpacing: '-0.02em' }}
          >
            {phase === 'celebration'
              ? gender === 'BOY'
                ? "🎉 It's a Boy! 💙"
                : "🎉 It's a Girl! 💗"
              : phase === 'fakeout1'
                ? '...almost... 👀'
                : 'The moment of truth...'}
          </motion.h1>
        </AnimatePresence>

        {/* CTA */}
        {!started && (
          <motion.button
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.06, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={startSequence}
            className="gr-btn-gradient text-2xl font-black px-12 py-6 mb-4"
            style={{
              borderRadius: '1.25rem',
              boxShadow: '0 0 50px rgba(139,92,246,0.5)',
            }}
          >
            🎊 Reveal the Baby!
          </motion.button>
        )}

        {/* Spin card */}
        {started && (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${display}-${spinIdx}-${phase}`}
              initial={
                phase === 'finalReveal'
                  ? { scale: 0.4, opacity: 0, rotate: -15, y: 30 }
                  : phase === 'fakeout1'
                    ? { scale: 1.05, opacity: 0.6 }
                    : { y: -18, opacity: 0 }
              }
              animate={
                phase === 'finalReveal'
                  ? { scale: 1, opacity: 1, rotate: 0, y: 0 }
                  : phase === 'celebration'
                    ? { scale: 1.08, opacity: 1 }
                    : phase === 'fakeout1'
                      ? {
                          scale: 1,
                          opacity: 1,
                          rotate: [0, -6, 6, -6, 6, 0] as never,
                        }
                      : { y: 0, opacity: 1 }
              }
              exit={{ y: 22, opacity: 0 }}
              transition={
                phase === 'finalReveal'
                  ? { type: 'spring', stiffness: 280, damping: 18 }
                  : phase === 'fakeout1'
                    ? { duration: 0.55 }
                    : { duration: 0.07 }
              }
              className="flex flex-col items-center gap-4 px-16 py-10 rounded-3xl"
              style={{
                background: cardBg,
                border: `2px solid ${cardBorder}`,
                boxShadow: `0 0 60px ${cardGlow}, 0 30px 60px rgba(0,0,0,0.5)`,
                backdropFilter: 'blur(20px)',
                transition:
                  'background 0.3s, border-color 0.3s, box-shadow 0.3s',
              }}
            >
              <span className="text-8xl sm:text-9xl">
                {display === 'BOY' ? '👦' : '👧'}
              </span>
              <span
                className="text-5xl sm:text-6xl font-black tracking-widest"
                style={{ color: labelColor }}
              >
                {display}
              </span>

              {/* Spinning dots */}
              {(phase === 'spinning' ||
                phase === 'slowdown' ||
                phase === 'fakeout2') && (
                <div className="flex gap-2 mt-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: labelColor }}
                      animate={{
                        opacity: [0.2, 1, 0.2],
                        scale: [0.8, 1.2, 0.8],
                      }}
                      transition={{
                        duration: 0.5,
                        delay: i * 0.15,
                        repeat: Infinity,
                      }}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Fakeout tease */}
        {phase === 'fakeout1' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 text-xl font-black"
            style={{ color: '#fbbf24' }}
          >
            Wait wait wait... are you sure?? 🤔
          </motion.div>
        )}

        {/* Celebration text */}
        {phase === 'celebration' && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-8"
          >
            <p className="text-xl" style={{ color: 'rgba(255,255,255,0.75)' }}>
              {gender === 'BOY'
                ? 'A bouncing baby boy is on the way! 🚀'
                : 'A beautiful baby girl is on the way! 🌸'}
            </p>
            <p
              className="text-sm mt-2"
              style={{ color: 'rgba(255,255,255,0.4)' }}
            >
              Congratulations to the whole family! 🎉
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
