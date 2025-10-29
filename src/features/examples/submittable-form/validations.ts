import z from 'zod'

export const submittableFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
})

export type SubmittableFormType = z.infer<typeof submittableFormSchema>
