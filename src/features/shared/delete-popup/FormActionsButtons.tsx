import Button from '$/lib/components/ui/buttons/Button'
import { cn } from '$/lib/utils/styling'

type FormActionsButtonsProps = {
  setOpen?: (open: boolean) => void
  onCancel?: () => void
  isPending?: boolean
  confirmText?: string
  confirmClassName?: string
  type?: 'submit' | 'button'
  onButtonClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  className?: string
}
export default function FormActionsButtons({
  setOpen,
  isPending,
  confirmClassName,
  confirmText,
  type = 'submit',
  onButtonClick,
  onCancel,
  className = '',
}: FormActionsButtonsProps) {
  return (
    <div className={cn('flex items-center justify-end gap-2.5', className)}>
      <Button
        variant="btn-white"
        className="h-11 w-fit border border-neutral-inputBorder px-4 py-2.5 text-sm font-normal text-accent"
        onClick={() => {
          onCancel?.()
          setOpen?.(false)
        }}
      >
        Cancel
      </Button>
      <Button
        onClick={onButtonClick}
        isLoading={isPending}
        disabled={isPending}
        className={cn(
          'h-11 w-fit px-4 py-2.5 text-sm font-normal',
          confirmClassName,
        )}
        type={type}
      >
        {confirmText ?? 'Save'}
      </Button>
    </div>
  )
}
