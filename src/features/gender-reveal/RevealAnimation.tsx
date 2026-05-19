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

type Phase =
  | 'idle'
  | 'spinning'
  | 'slowdown'
  | 'fakeout1'
  | 'fakeout2'
  | 'finalReveal'
  | 'celebration'

type Confetti = {
  id: number
  x: number
  color: string
  size: number
  delay: number
  duration: number
  rotate: number
}

function useConfetti(active: boolean, gender: Gender) {
  return useMemo<Confetti[]>(() => {
    if (!active) return []
    const boyColors = [
      '#3B82F6',
      '#60A5FA',
      '#93C5FD',
      '#BFDBFE',
      '#DBEAFE',
      '#fff',
    ]
    const girlColors = [
      '#EC4899',
      '#F472B6',
      '#F9A8D4',
      '#FBCFE8',
      '#FF80B5',
      '#fff',
    ]
    const colors = gender === 'BOY' ? boyColors : girlColors
    return Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 6 + Math.random() * 10,
      delay: Math.random() * 0.8,
      duration: 2.5 + Math.random() * 2,
      rotate: Math.random() * 720 - 360,
    }))
  }, [active, gender])
}

interface RevealAnimationProps {
  gender: Gender
  onComplete?: () => void
}

const SPINNER_SEQUENCE: Gender[] = [
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

export default function RevealAnimation({
  gender,
  onComplete,
}: RevealAnimationProps) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [spinIndex, setSpinIndex] = useState(0)
  const [displayGender, setDisplayGender] = useState<Gender>('BOY')
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

    // Phase 1: Fast spinning (0–2.5s)
    let idx = 0
    let speed = 80
    const spin = () => {
      intervalRef.current = setInterval(() => {
        idx++
        setSpinIndex(idx)
        setDisplayGender(SPINNER_SEQUENCE[idx % SPINNER_SEQUENCE.length])
      }, speed)
    }
    spin()

    // Phase 2: Slowdown at 2.5s
    setTimeout(() => {
      clearSpin()
      speed = 300
      setPhase('slowdown')
      spin()
    }, 2500)

    // Phase 3: First fake-out — land on WRONG answer
    const wrongGender: Gender = gender === 'BOY' ? 'GIRL' : 'BOY'
    setTimeout(() => {
      clearSpin()
      setPhase('fakeout1')
      setDisplayGender(wrongGender) // ALMOST!
    }, 3600)

    // Phase 4: Shake & spin again briefly
    setTimeout(() => {
      setPhase('fakeout2')
      speed = 120
      spin()
    }, 4400)

    // Phase 5: Final reveal
    setTimeout(() => {
      clearSpin()
      setPhase('finalReveal')
      setDisplayGender(gender)
    }, 5200)

    // Phase 6: Celebration
    setTimeout(() => {
      setPhase('celebration')
      onComplete?.()
    }, 6200)
  }

  // Cleanup on unmount
  useEffect(() => () => clearSpin(), [])

  const isBoy = displayGender === 'BOY'
  const bgColor = isBoy
    ? 'from-blue-950 via-blue-900 to-indigo-950'
    : 'from-pink-950 via-rose-900 to-purple-950'

  const cardColor = isBoy
    ? 'border-blue-400 bg-blue-500/20 shadow-[0_0_60px_rgba(59,130,246,0.5)]'
    : 'border-pink-400 bg-pink-500/20 shadow-[0_0_60px_rgba(236,72,153,0.5)]'

  return (
    <div
      className={`relative min-h-screen flex flex-col items-center justify-center overflow-hidden transition-all duration-700 bg-linear-to-br ${
        phase === 'celebration'
          ? bgColor
          : 'from-purple-950 via-indigo-950 to-slate-950'
      }`}
    >
      {/* Confetti rain */}
      {phase === 'celebration' &&
        confetti.map((c) => (
          <motion.div
            key={c.id}
            className="fixed pointer-events-none"
            style={{
              left: `${c.x}%`,
              top: -20,
              width: c.size,
              height: c.size * 0.4,
              backgroundColor: c.color,
              borderRadius: 2,
            }}
            animate={{
              y: ['0vh', '110vh'],
              rotate: [0, c.rotate],
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: c.duration,
              delay: c.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}

      {/* Balloon burst on celebration */}
      {phase === 'celebration' && (
        <>
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.div
              key={i}
              className="fixed text-5xl pointer-events-none"
              style={{ left: `${8 + i * 9}%`, bottom: -60 }}
              animate={{
                y: '-115vh',
                x: [0, i % 2 === 0 ? 30 : -30, 0],
                rotate: [0, 15, -15, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                delay: i * 0.15,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {gender === 'BOY' ? '💙' : '💗'}
            </motion.div>
          ))}
        </>
      )}

      {/* Main card */}
      <div className="relative z-10 flex flex-col items-center px-6">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl font-extrabold text-white mb-10 text-center"
        >
          {phase === 'celebration'
            ? gender === 'BOY'
              ? "It's a Boy! 💙"
              : "It's a Girl! 💗"
            : phase === 'fakeout1'
              ? '...almost...'
              : 'The moment of truth...'}
        </motion.h1>

        {/* Start button */}
        {!started && (
          <motion.button
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startSequence}
            className="px-10 py-5 rounded-2xl text-2xl font-black bg-linear-to-r from-pink-500 via-purple-500 to-blue-500 text-white shadow-2xl animate-pulse"
          >
            🎊 Reveal the Baby!
          </motion.button>
        )}

        {/* Spinning card */}
        {started && (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${displayGender}-${spinIndex}-${phase}`}
              initial={
                phase === 'finalReveal'
                  ? { scale: 0.5, opacity: 0, rotate: -10 }
                  : phase === 'fakeout1'
                    ? { scale: 1.1, opacity: 0.7 }
                    : { y: -20, opacity: 0 }
              }
              animate={
                phase === 'celebration'
                  ? { scale: 1.1, opacity: 1 }
                  : phase === 'fakeout1'
                    ? { scale: 1, opacity: 1, rotate: [0, -4, 4, -4, 4, 0] }
                    : phase === 'finalReveal'
                      ? { scale: 1, opacity: 1, rotate: 0 }
                      : { y: 0, opacity: 1 }
              }
              exit={{ y: 20, opacity: 0 }}
              transition={
                phase === 'finalReveal'
                  ? { type: 'spring', stiffness: 300, damping: 18 }
                  : phase === 'fakeout1'
                    ? { duration: 0.6 }
                    : { duration: 0.08 }
              }
              className={`flex flex-col items-center gap-4 px-16 py-10 rounded-3xl border-2 ${cardColor} transition-colors duration-300`}
            >
              <span className="text-7xl sm:text-8xl">
                {displayGender === 'BOY' ? '👦' : '👧'}
              </span>
              <span
                className={`text-5xl sm:text-6xl font-black tracking-widest ${
                  displayGender === 'BOY' ? 'text-blue-300' : 'text-pink-300'
                }`}
              >
                {displayGender}
              </span>
              {(phase === 'spinning' || phase === 'fakeout2') && (
                <div className="flex gap-1 mt-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        displayGender === 'BOY' ? 'bg-blue-400' : 'bg-pink-400'
                      }`}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{
                        duration: 0.6,
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

        {/* Fake-out alert */}
        {phase === 'fakeout1' && (
          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 text-yellow-300 text-xl font-bold animate-pulse"
          >
            Wait... are you sure? 👀
          </motion.p>
        )}

        {/* Celebration message */}
        {phase === 'celebration' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-center"
          >
            <p className="text-white/70 text-lg">
              {gender === 'BOY'
                ? 'A bouncing baby boy is on the way! 🚀'
                : 'A beautiful baby girl is on the way! 🌸'}
            </p>
            <p className="text-white/40 text-sm mt-2">
              Congratulations to the whole family! 🎉
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
