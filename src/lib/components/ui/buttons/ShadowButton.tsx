import type { ComponentProps, PropsWithChildren } from 'react'

import { cn } from '$/lib/utils/styling'

type ShadowButtonProps = ComponentProps<'button'>

export default function ShadowButton({
  type,
  className,
  children,
  ...buttonProps
}: PropsWithChildren<ShadowButtonProps>) {
  return (
    <button
      type={type || 'button'}
      className={cn(
        'cursor-pointer rounded-lg bg-transparent px-2 py-2.5 duration-200 hover:bg-grey/10 disabled:cursor-not-allowed disabled:bg-transparent disabled:opacity-50',
        className,
      )}
      {...buttonProps}
    >
      {children}
    </button>
  )
}
