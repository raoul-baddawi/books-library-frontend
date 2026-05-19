import { motion } from 'framer-motion'

import { useGuesses } from './api'

export default function VoteTally() {
  const { data: guesses = [] } = useGuesses()

  const boyCount = guesses.filter((g) => g.guess === 'BOY').length
  const girlCount = guesses.filter((g) => g.guess === 'GIRL').length
  const total = boyCount + girlCount
  const boyPct = total === 0 ? 50 : Math.round((boyCount / total) * 100)
  const girlPct = 100 - boyPct

  const initials = (name: string) =>
    name
      .split(' ')
      .map((w) => w[0]?.toUpperCase())
      .join('')
      .slice(0, 2)

  return (
    <div className="gr-card p-6">
      <h3 className="text-center gr-muted text-xs font-semibold uppercase tracking-widest mb-6">
        ⚡ Live Votes &nbsp;&middot;&nbsp; {total}{' '}
        {total === 1 ? 'guess' : 'guesses'}
      </h3>

      {/* Labels */}
      <div className="flex justify-between text-sm font-bold mb-2">
        <span className="gr-boy-text">💙 Boy &mdash; {boyCount}</span>
        <span className="gr-girl-text">Girl &mdash; {girlCount} 💗</span>
      </div>

      {/* Progress bar */}
      <div
        className="relative h-4 rounded-full overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <motion.div
          className="absolute left-0 top-0 h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #1d4ed8, #3b82f6)' }}
          initial={{ width: '50%' }}
          animate={{ width: `${boyPct}%` }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute right-0 top-0 h-full rounded-full"
          style={{ background: 'linear-gradient(270deg, #be185d, #ec4899)' }}
          initial={{ width: '50%' }}
          animate={{ width: `${girlPct}%` }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
        />
      </div>

      <div
        className="flex justify-between text-xs mt-2"
        style={{ color: 'rgba(255,255,255,0.35)' }}
      >
        <span>{boyPct}%</span>
        <span>{girlPct}%</span>
      </div>

      {/* Recent guesses */}
      {guesses.length > 0 && (
        <div className="mt-6">
          <p className="gr-faint text-xs uppercase tracking-widest mb-3 text-white!">
            Recent guesses
          </p>
          <div className="flex flex-col gap-2 max-h-44 overflow-y-auto pr-1">
            {[...guesses]
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime(),
              )
              .slice(0, 12)
              .map((g) => (
                <motion.div
                  key={g.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3"
                >
                  {/* Avatar */}
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{
                      background:
                        g.guess === 'BOY'
                          ? 'linear-gradient(135deg,#1d4ed8,#3b82f6)'
                          : 'linear-gradient(135deg,#be185d,#ec4899)',
                    }}
                  >
                    {initials(g.name)}
                  </div>
                  <span className="text-white text-sm flex-1 truncate">
                    {g.name}
                  </span>
                  <span
                    className={
                      g.guess === 'BOY' ? 'gr-badge-boy' : 'gr-badge-girl'
                    }
                  >
                    {g.guess === 'BOY' ? 'Boy' : 'Girl'}
                  </span>
                </motion.div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
