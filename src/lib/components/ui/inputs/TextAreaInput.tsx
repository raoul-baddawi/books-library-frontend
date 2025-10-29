import { type ComponentProps } from 'react'
import TextAreaAutoResize from 'react-textarea-autosize'

import { cn } from '$/lib/utils/styling'

export default function TextAreaInput({
  minRows,
  className,
  ...props
}: ComponentProps<typeof TextAreaAutoResize>) {
  return (
    <TextAreaAutoResize
      minRows={Math.min(4, minRows || 4)}
      maxRows={10}
      className={cn(
        'w-full resize-none rounded-lg border border-border bg-white px-4 py-2.5 text-sm outline-hidden duration-200 placeholder:text-grey focus-within:outline-primary focus:border-accent disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger focus:aria-invalid:border-accent',
        className,
      )}
      {...props}
    />
  )
}
