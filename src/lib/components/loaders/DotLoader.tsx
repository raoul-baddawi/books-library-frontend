import { cn } from '$/lib/utils/styling'

type DotLoaderProps = {
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
  dotsLength?: number
}

export default function DotLoader({
  size = 'md',
  className = '',
  dotsLength = 3,
}: DotLoaderProps) {
  const sizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
    xs: 'w-1 h-1',
  }

  const gapClasses = {
    sm: 'gap-1',
    md: 'gap-1.5',
    lg: 'gap-2',
    xs: 'gap-0.5',
  }

  const ArrayFromDotsLength = Array.from({ length: dotsLength }).map(
    (_, index) => index,
  )

  const delayStep = 0.09
  const duration = dotsLength * delayStep + 0.2

  return (
    <div className={cn('flex items-center', gapClasses[size], className)}>
      {ArrayFromDotsLength.map((index) => (
        <div
          key={index}
          className={cn(
            sizeClasses[size],
            'animate-pulse rounded-full bg-current transition-all duration-300 ease-in-out',
          )}
          style={{
            animationDelay: `${index * delayStep}s`,
            animationDuration: `${duration}s`,
            animationIterationCount: 'infinite',
            animationDirection: 'alternate',
          }}
        />
      ))}
    </div>
  )
}
