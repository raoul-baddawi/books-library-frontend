/// <reference types="vite/client" />
/// <reference types="vite/types/importMeta.d.ts" />

import ky, { HTTPError } from 'ky'
import { z } from 'zod'

import { tryCatch } from './tryCatch'

export type ApiError = z.infer<typeof nestJsErrorSchema>

export const rawApiClientClient = ky.create({
  prefixUrl: import.meta.env.VITE_BASE_API_URL,
  retry: 0,
})

const nestJsErrorSchema = z.object({
  message: z.union([z.string(), z.array(z.string())]),
  error: z.string().optional(),
  statusCode: z.number(),
})

export const apiClient = rawApiClientClient.extend({
  credentials: 'include',
  hooks: {
    afterResponse: [
      async (request, options, response) => {
        if (!response.ok) {
          const jsonResponse = await tryCatch(() => response.json())
          if (jsonResponse.error) return response

          const parsedResponse = nestJsErrorSchema.safeParse(jsonResponse.data)
          if (!parsedResponse.success) {
            const error = new HTTPError(response, request, options)
            error.message = `Request failed with status ${response.status}`
            throw error
          }

          throw parsedResponse.data
        }

        return response
      },
    ],
  },
})
