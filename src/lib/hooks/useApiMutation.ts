import {
  type QueryClient,
  useMutation,
  type UseMutationOptions,
} from '@tanstack/react-query'
import { HTTPError } from 'ky'
import { toast } from 'sonner'

import type { ApiError } from '../utils/apiClient'

type UseApiMutationOptions<
  TData = unknown,
  TError extends HTTPError = HTTPError<ApiError>,
  TVariables = void,
  TContext = unknown,
> = UseMutationOptions<TData, TError, TVariables, TContext> & {
  hideErrorToast?: boolean
}

export default function useApiMutation<
  TData = unknown,
  TError extends HTTPError = HTTPError<ApiError>,
  TVariables = void,
  TContext = unknown,
>(
  options: UseApiMutationOptions<TData, TError, TVariables, TContext>,
  queryClient?: QueryClient,
) {
  return useMutation<TData, TError, TVariables, TContext>(
    {
      ...options,
      onError: (...errorArgs) => {
        if (!options.hideErrorToast) {
          const errorMessage =
            errorArgs[0].message ||
            "Un problème s'est produit, veuillez réessayer"

          toast.error(errorMessage)
        }
        return options.onError?.(...errorArgs)
      },
    },
    queryClient,
  )
}
