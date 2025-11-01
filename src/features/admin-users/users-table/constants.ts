import { UserRoleType } from '$/lib/providers/AuthProvider'

export const roleLabels: Record<UserRoleType, string> = {
  AUTHOR: 'Author',
  ADMIN: 'Admin',
}

export const roleColors: Record<UserRoleType, string> = {
  AUTHOR: 'text-primary bg-primary-light border-primary border ',
  ADMIN: 'text-purple bg-purple-light border-purple border',
}
