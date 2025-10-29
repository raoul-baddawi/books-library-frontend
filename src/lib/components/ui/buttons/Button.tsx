import { type ComponentProps, forwardRef, type PropsWithChildren } from 'react'

import { cn } from '$/lib/utils/styling'

import DotLoader from '../../loaders/DotLoader'
import type { ButtonVariantType } from './types'

interface Props extends ComponentProps<'button'> {
  isLoading?: boolean
  variant?: ButtonVariantType
}

const Button = forwardRef<HTMLButtonElement, PropsWithChildren<Props>>(
  (
    {
      className,
      isLoading,
      disabled,
      type,
      children,
      variant = 'btn-primary',
      ...buttonProps
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type || 'button'}
        aria-busy={isLoading}
        className={cn(
          'btn-primary text-white',
          variant,
          className,
          disabled || isLoading ? 'cursor-not-allowed! opacity-50' : '',
        )}
        disabled={disabled || isLoading}
        {...buttonProps}
      >
        {children}
        {isLoading && <DotLoader size="xs" />}
      </button>
    )
  },
)

Button.displayName = 'Button'

export default Button
