import { z } from 'zod'

export const bookFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  genre: z
    .string({
      errorMap: () => ({ message: 'Genre is required' }),
    })
    .min(1, 'Genre is required'),
  authorId: z
    .string({
      errorMap: () => ({ message: 'Author is required' }),
    })
    .min(1, 'Author name is required'),
})

export type BookFormType = z.infer<typeof bookFormSchema>
