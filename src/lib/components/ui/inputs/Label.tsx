import type { ComponentProps } from 'react'

import { cn } from '$/lib/utils/styling'

export default function Label({
  className,
  ...props
}: ComponentProps<'label'>) {
  return (
    <label
      className={cn('mb-2 block text-sm font-medium', className)}
      {...props}
    ></label>
  )
}
