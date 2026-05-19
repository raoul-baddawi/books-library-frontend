import { useQueryClient } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import {
  useGuesses,
  useRevealSettings,
  useTriggerReveal,
  useUpdateSettings,
} from './api'
import FloatingParticles from './FloatingParticles'
import StarField from './StarField'
import type { Gender, GenderGuess } from './types'
import { apiClient } from '$/lib/utils/apiClient'

// ── Login gate ────────────────────────────────────────────────────────────────

function LoginGate({ onUnlock }: { onUnlock: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [shake, setShake] = useState(false)

  // If already authenticated, unlock immediately
  useEffect(() => {
    apiClient
      .get('auth/me')
      .json()
      .then(() => onUnlock())
      .catch(() => {})
  }, [onUnlock])

  const attempt = async () => {
    if (!email.trim() || !password) return
    setIsLoading(true)
    try {
      await apiClient.post('auth/login', { json: { email, password } }).json()
      onUnlock()
    } catch {
      setShake(true)
      setPassword('')
      setTimeout(() => setShake(false), 600)
      toast.error('Invalid credentials')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="gr-page flex items-center justify-center overflow-hidden">
      <StarField count={80} />
      <FloatingParticles count={10} />
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative z-10 gr-card p-10 w-full max-w-sm text-center"
      >
        <p className="text-5xl mb-4">🔐</p>
        <h1
          className="text-2xl font-black mb-1"
          style={{ letterSpacing: '-0.02em' }}
        >
          Parents Only
        </h1>
        <p className="gr-muted text-sm mb-8 text-white!">
          Sign in to access the control panel
        </p>

        <motion.div
          animate={shake ? { x: [-10, 10, -10, 10, -5, 5, 0] as never } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-3"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && attempt()}
            placeholder="Email"
            className="gr-input"
            autoFocus
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && attempt()}
            placeholder="Password"
            className="gr-input"
          />
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={attempt}
          disabled={isLoading || !email.trim() || !password}
          className="gr-btn-gradient mt-5"
          style={{ opacity: isLoading || !email.trim() || !password ? 0.5 : 1 }}
        >
          {isLoading ? 'Signing in…' : 'Sign in →'}
        </motion.button>
      </motion.div>
    </div>
  )
}

// ── Guess card ────────────────────────────────────────────────────────────────

function GuessCard({ guess }: { guess: GenderGuess }) {
  const [mediaIdx, setMediaIdx] = useState(0)
  const media = guess.mediaUrls ?? []
  const isBoy = guess.guess === 'BOY'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-4"
      style={{
        background: isBoy ? 'rgba(59,130,246,0.07)' : 'rgba(236,72,153,0.07)',
        border: `1px solid ${isBoy ? 'rgba(59,130,246,0.25)' : 'rgba(236,72,153,0.25)'}`,
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="font-semibold text-white!">{guess.name}</p>
          <p className="gr-faint text-xs text-white!">
            {new Date(guess.createdAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <span className={isBoy ? 'gr-badge-boy' : 'gr-badge-girl'}>
          {isBoy ? '💙 Boy' : '💗 Girl'}
        </span>
      </div>

      {media.length > 0 && (
        <div className="relative">
          {media[mediaIdx].match(/\.(mp4|mov|webm)$/i) ? (
            <video
              src={media[mediaIdx]}
              controls
              className="w-full rounded-xl max-h-48 object-cover"
            />
          ) : (
            <img
              src={media[mediaIdx]}
              alt="reaction"
              className="w-full rounded-xl max-h-48 object-cover"
            />
          )}
          {media.length > 1 && (
            <div className="flex gap-1 mt-2 justify-center">
              {media.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setMediaIdx(i)}
                  className="w-2 h-2 rounded-full transition-colors"
                  style={{
                    background:
                      i === mediaIdx ? '#fff' : 'rgba(255,255,255,0.28)',
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}

// ── Main dashboard ────────────────────────────────────────────────────────────

function ParentsDashboard() {
  const queryClient = useQueryClient()
  const { data: settings, isPending: isSettingsPending } = useRevealSettings()
  const { data: guesses = [], isPending: isGuessesPending } = useGuesses()
  const { mutateAsync: updateSettings, isPending: isUpdating } =
    useUpdateSettings()
  const { mutateAsync: triggerReveal, isPending: isRevealing } =
    useTriggerReveal()

  const [gender, setGender] = useState<Gender | null>(settings?.gender ?? null)
  const [revealDate, setRevealDate] = useState(
    settings?.revealDate ? settings.revealDate.slice(0, 16) : '',
  )
  const [filter, setFilter] = useState<'ALL' | 'BOY' | 'GIRL'>('ALL')

  const boyCount = guesses.filter((g) => g.guess === 'BOY').length
  const girlCount = guesses.filter((g) => g.guess === 'GIRL').length
  const filtered = guesses.filter((g) => filter === 'ALL' || g.guess === filter)

  const handleSave = async () => {
    await updateSettings(
      {
        gender: gender ?? undefined,
        revealDate: revealDate ? new Date(revealDate).toISOString() : null,
      },
      {
        onSuccess: () => {
          toast.success('Settings saved!')
          queryClient.invalidateQueries({
            queryKey: ['gender-reveal', 'settings'],
          })
        },
      },
    )
  }

  const handleReveal = async () => {
    if (!gender) {
      toast.error('Please set the baby gender first.')
      return
    }
    await triggerReveal(undefined, {
      onSuccess: () => {
        toast.success('🎉 Reveal triggered!')
        queryClient.invalidateQueries({
          queryKey: ['gender-reveal', 'settings'],
        })
      },
    })
  }

  return (
    <div className="gr-page overflow-auto">
      <StarField count={70} />
      <FloatingParticles count={8} />
      <div className="relative z-10 max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <p className="text-5xl mb-3">👑</p>
          <h1
            className="text-3xl font-black gr-gradient-text mb-2"
            style={{ letterSpacing: '-0.02em' }}
          >
            Parents Control Panel
          </h1>
          <p className="gr-muted text-sm text-white!">
            Set the gender, schedule the reveal, watch the guesses.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.18 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          {[
            {
              label: 'Total Guesses',
              value: guesses.length,
              emoji: '🗳️',
              className: ' text-white!',
            },
            {
              label: 'Voted Boy',
              value: boyCount,
              emoji: '💙',
              className: ' text-blue!',
            },
            {
              label: 'Voted Girl',
              value: girlCount,
              emoji: '💗',
              className: ' text-[#ec4899]!',
            },
          ].map((s) => (
            <div key={s.label} className="gr-card p-4 text-center">
              <p className="text-2xl mb-1">{s.emoji}</p>
              <p className="text-3xl font-black text-white/70!">{s.value}</p>
              <p className={`gr-faint text-xs mt-1 ${s.className}`}>
                {s.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Settings panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="gr-card p-7 mb-6"
        >
          <h2 className="text-lg font-bold mb-6">⚙️ Reveal Settings</h2>

          {/* Gender picker */}
          <p className="gr-muted text-sm mb-3 text-white!">
            Baby's gender (kept secret until reveal)
          </p>
          <div className="flex gap-4 mb-6">
            {(['BOY', 'GIRL'] as Gender[]).map((g) => {
              const active = gender === g
              const isBoy = g === 'BOY'
              return (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className="flex-1 py-3 rounded-xl font-bold border-2 transition-all"
                  style={{
                    background: active
                      ? isBoy
                        ? 'rgba(59,130,246,0.18)'
                        : 'rgba(236,72,153,0.18)'
                      : 'rgba(255,255,255,0.04)',
                    borderColor: active
                      ? isBoy
                        ? '#60a5fa'
                        : '#f472b6'
                      : 'rgba(255,255,255,0.12)',
                    color: active
                      ? isBoy
                        ? '#60a5fa'
                        : '#f472b6'
                      : 'rgba(255,255,255,0.45)',
                    boxShadow: active
                      ? `0 0 24px ${isBoy ? 'rgba(59,130,246,0.3)' : 'rgba(236,72,153,0.3)'}`
                      : 'none',
                  }}
                >
                  {g === 'BOY' ? '💙 Boy' : '💗 Girl'}
                </button>
              )
            })}
          </div>
          {settings?.isRevealed && (
            <p
              className="text-sm text-center mb-5 "
              style={{ color: '#4ade80' }}
            >
              ✅ Gender has been revealed to guests
            </p>
          )}

          {/* Reveal date */}
          <p className="gr-muted text-sm mb-2 text-white!">
            Schedule reveal date &amp; time (optional)
          </p>
          <input
            type="datetime-local"
            value={revealDate}
            onChange={(e) => setRevealDate(e.target.value)}
            className="gr-input-dark mb-1"
          />
          {revealDate && (
            <p className="gr-faint text-xs mb-5  text-white!">
              Countdown will show on guest page until this time.
            </p>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 mt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSave}
              disabled={isUpdating || isSettingsPending}
              className="gr-btn-solid flex-1"
            >
              {isUpdating ? 'Saving…' : '💾 Save Settings'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleReveal}
              disabled={isRevealing || !gender || settings?.isRevealed}
              className="gr-btn-gradient flex-1"
              style={{
                opacity:
                  isRevealing || !gender || settings?.isRevealed ? 0.45 : 1,
              }}
            >
              {isRevealing
                ? '🎊 Revealing…'
                : settings?.isRevealed
                  ? '✅ Already Revealed!'
                  : '🎉 Reveal Now!'}
            </motion.button>
          </div>
        </motion.div>

        {/* Submissions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38 }}
          className="gr-card p-7"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold">🗳️ All Submissions</h2>
            <div className="flex gap-2">
              {(['ALL', 'BOY', 'GIRL'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="px-3 py-1 rounded-full text-xs font-semibold transition-all"
                  style={{
                    background:
                      filter === f
                        ? 'rgba(139,92,246,0.55)'
                        : 'rgba(255,255,255,0.06)',
                    color: filter === f ? '#fff' : 'rgba(255,255,255,0.5)',
                    border: `1px solid ${filter === f ? 'rgba(139,92,246,0.7)' : 'rgba(255,255,255,0.1)'}`,
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {isGuessesPending ? (
            <p className="text-center py-8 gr-faint text-white!">Loading…</p>
          ) : filtered.length === 0 ? (
            <p className="text-center py-8 gr-faint text-white!">
              No guesses yet!
            </p>
          ) : (
            <AnimatePresence>
              <div className="grid sm:grid-cols-2 gap-4">
                {filtered.map((g) => (
                  <GuessCard key={g.id} guess={g} />
                ))}
              </div>
            </AnimatePresence>
          )}
        </motion.div>
      </div>
    </div>
  )
}

// ── Export ────────────────────────────────────────────────────────────────────

export default function ParentsPage() {
  const [unlocked, setUnlocked] = useState(false)
  return unlocked ? (
    <ParentsDashboard />
  ) : (
    <LoginGate onUnlock={() => setUnlocked(true)} />
  )
}
