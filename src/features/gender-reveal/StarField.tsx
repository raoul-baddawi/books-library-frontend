import { useMemo } from 'react'

type Star = {
  id: number
  x: number
  y: number
  size: number
  dur: number
  delay: number
}

export default function StarField({ count = 110 }: { count?: number }) {
  const stars = useMemo<Star[]>(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 0.5 + Math.random() * 2.2,
        dur: 2 + Math.random() * 5,
        delay: Math.random() * 8,
      })),
    [count],
  )

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            animation: `gr-twinkle ${s.dur}s ${s.delay}s infinite ease-in-out`,
          }}
        />
      ))}
    </div>
  )
}
