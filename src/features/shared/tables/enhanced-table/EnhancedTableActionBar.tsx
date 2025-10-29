import type { PropsWithChildren } from 'react'

import EnhancedTableSearchFilter from './EnhancedTableSearchFilter'

type EnhancedTableActionBarProps = {
  searchPlaceholder?: string
}

// TODO: add other fixed buttons + required props
export default function EnhancedTableActionBar({
  children,
  searchPlaceholder,
}: PropsWithChildren<EnhancedTableActionBarProps>) {
  return (
    <div className="bg-snow flex w-full flex-col items-center justify-between gap-4 rounded px-4 py-2 md:items-start lg:flex-row lg:items-center">
      <EnhancedTableSearchFilter placeHolder={searchPlaceholder} />
      {/* wrapper for buttons */}
      <div className="flex flex-wrap gap-4">{children && children}</div>
    </div>
  )
}
