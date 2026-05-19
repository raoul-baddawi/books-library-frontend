import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

type TimeLeft = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getTimeLeft(targetDate: string): TimeLeft {
  const diff = Math.max(0, new Date(targetDate).getTime() - Date.now())
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1000),
  }
}

export default function Countdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft(targetDate))
  const isExpired = Object.values(timeLeft).every((v) => v === 0)

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft(targetDate)), 1000)
    return () => clearInterval(id)
  }, [targetDate])

  if (isExpired) return null

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Mins', value: timeLeft.minutes },
    { label: 'Secs', value: timeLeft.seconds },
  ]

  return (
    <div className="text-center">
      <p className="gr-muted text-xs font-semibold uppercase tracking-widest mb-4">
        ⏳ Reveal in
      </p>
      <div className="flex gap-3">
        {units.map(({ label, value }) => (
          <div key={label} className="flex flex-col items-center">
            <motion.div
              key={value}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="w-[60px] h-[60px] rounded-2xl flex items-center justify-center"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 0 20px rgba(139,92,246,0.12)',
              }}
            >
              <span className="text-2xl font-black tabular-nums text-white">
                {String(value).padStart(2, '0')}
              </span>
            </motion.div>
            <span className="gr-faint text-xs mt-1.5 font-medium">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
