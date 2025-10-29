import { TriangleAlertIcon } from 'lucide-react'

type InputErrorProps = {
  id?: string
  message: string
}

export default function InputError({ id, message }: InputErrorProps) {
  return (
    <span
      id={id}
      role="alert"
      className="mt-1 flex items-center gap-1 text-xs text-danger"
    >
      <TriangleAlertIcon className="size-3.5" />
      <em>{message}</em>
    </span>
  )
}
