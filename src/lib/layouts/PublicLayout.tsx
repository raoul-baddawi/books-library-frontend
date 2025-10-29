import type { PropsWithChildren } from 'react'

import Header from '$/components/Header'

export default function PublicLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {children}
    </div>
  )
}
