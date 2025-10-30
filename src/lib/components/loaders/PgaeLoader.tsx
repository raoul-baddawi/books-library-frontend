import DotLoader from './DotLoader'
import { cn } from '$/lib/utils/styling'
type Props = {
  className?: string
}
function PageLoader({ className }: Props) {
  return (
    <div
      className={cn(
        'flex h-full w-full items-center justify-center',
        className,
      )}
    >
      <DotLoader size="lg" dotsLength={6} />
    </div>
  )
}

export default PageLoader
