import { zodFilesValidator } from '$/lib/utils/functions'
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
  media: zodFilesValidator(
    {
      minCount: 1,
    },
    {
      errorMessage: 'At least one photo is required',
    },
  ),
})

export type BookFormType = z.infer<typeof bookFormSchema>
