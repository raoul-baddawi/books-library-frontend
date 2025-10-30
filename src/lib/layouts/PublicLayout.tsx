import Header from '$/components/Header'
import type { PropsWithChildren } from 'react'

export default function PublicLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-white!">
      <Header />
      {children}
    </div>
  )
}
