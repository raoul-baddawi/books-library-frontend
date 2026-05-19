import { useMemo } from 'react'

type Particle = {
  id: number
  x: number
  size: number
  delay: number
  duration: number
  emoji: string
}

const EMOJIS = ['✨', '⭐', '🌟', '💫', '🎀', '🎊', '🎉', '🌸', '🍭', '💝']

export default function FloatingParticles({ count = 16 }: { count?: number }) {
  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: 2 + Math.random() * 96,
        size: 0.9 + Math.random() * 1.1,
        delay: Math.random() * 12,
        duration: 10 + Math.random() * 12,
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      })),
    [count],
  )

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute bottom-0 select-none"
          style={{
            left: `${p.x}%`,
            fontSize: `${p.size}rem`,
            animation: `gr-float ${p.duration}s ${p.delay}s infinite linear`,
          }}
        >
          {p.emoji}
        </div>
      ))}
    </div>
  )
}
