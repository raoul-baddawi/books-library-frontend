import { type ComponentProps } from 'react'

import { cn } from '$/lib/utils/styling'

export default function TextInput({
  className,
  type,
  ...props
}: ComponentProps<'input'>) {
  return (
    <input
      type={type || 'text'}
      formNoValidate
      {...(type === 'number' && !props.step ? { step: 'any' } : {})}
      className={cn(
        'w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-accent outline-hidden duration-200 placeholder:text-grey focus-within:outline-primary focus:border-accent disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger focus:aria-invalid:border-accent',
        className,
      )}
      {...props}
    />
  )
}
