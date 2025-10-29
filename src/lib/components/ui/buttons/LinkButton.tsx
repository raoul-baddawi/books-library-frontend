import { Link, type LinkProps } from '@tanstack/react-router'
import type { PropsWithChildren } from 'react'

import { cn } from '$/lib/utils/styling'

import type { ButtonVariantType } from './types'

interface LinkButtonProps extends LinkProps {
  variant?: ButtonVariantType
  className?: string
}

export default function LinkButton({
  children,
  variant = 'btn-primary',
  className,
  ...props
}: PropsWithChildren<LinkButtonProps>) {
  return (
    <Link
      {...props}
      className={cn(
        'h-11 w-fit gap-2 px-2.5 py-4 text-sm font-normal',
        variant,
        className,
      )}
    >
      {children}
    </Link>
  )
}
