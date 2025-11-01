import { UserRoleType } from '$/lib/providers/AuthProvider'
import { cn } from '$/lib/utils/styling'
import { roleColors, roleLabels } from './constants'

type UserRoleTableCellProps = {
  userRole: UserRoleType
  className?: string
}
export default function UserRoleTableCell({
  userRole,
  className,
}: UserRoleTableCellProps) {
  return (
    <span
      className={cn(
        `ml-2 rounded px-2 py-1 text-sm font-medium w-full`,
        roleColors[userRole],
        className,
      )}
    >
      {roleLabels[userRole]}
    </span>
  )
}
