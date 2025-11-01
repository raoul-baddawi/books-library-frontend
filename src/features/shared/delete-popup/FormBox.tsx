import { PropsWithChildren } from 'react'

import { cn } from '$/lib/utils/styling'

type FormBoxProps = {
  title?: string
  description?: string
  className?: string
  contentClassName?: string
}

export default function FormBox({
  title,
  description,
  children,
  className,
  contentClassName,
}: PropsWithChildren<FormBoxProps>) {
  return (
    <div className={cn('h-full  rounded-lg', className)}>
      {(title || description) && (
        <div className="mb-[22px]">
          <h2 className="text-xl font-bold">{title}</h2>
          {!!description && (
            <p className="text-sm font-normal text-neutral-medium">
              {description}
            </p>
          )}
        </div>
      )}
      <div className={cn('flex flex-col gap-4', contentClassName)}>
        {children}
      </div>
    </div>
  )
}
