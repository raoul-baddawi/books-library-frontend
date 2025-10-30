import { UserRoleType } from '$/lib/providers/AuthProvider'

export type UserTableType = {
  id: number
  fullName: string
  email: string
  role: UserRoleType
  createdAt: string
  actions?: string
}

export type UserTableResponseType = {
  count: number
  data: UserTableType[]
}

export type UserTableFiltersType = {
  search?: string
  dateRange?: null | {
    startDate: string
    endDate: string
  }
}
