import { z } from 'zod'

import { UserRoleEnum } from '$/lib/providers/AuthProvider'

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

export function userFormSchemaFunction(shouldRequirePassword: boolean) {
  if (shouldRequirePassword) {
    return userFormSchema.extend({
      password: z
        .string()
        .min(6, 'Password must be at least 6 characters long'),
    })
  }
  return userFormSchema
}
export type UserFormType = z.infer<typeof userFormSchema>
