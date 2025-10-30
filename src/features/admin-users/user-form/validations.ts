import { UserRoleEnum } from '$/lib/providers/AuthProvider'
import { z } from 'zod'

export const zodRoleEnumSchema = z.enum([
  UserRoleEnum.ADMIN,
  UserRoleEnum.AUTHOR,
])

export const userFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().optional(),
  role: zodRoleEnumSchema,
})

export type UserFormType = z.infer<typeof userFormSchema>
