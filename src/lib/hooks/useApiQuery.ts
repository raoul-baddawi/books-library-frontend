import type {
  DefinedInitialDataOptions,
  DefinedUseQueryResult,
  QueryClient,
  QueryFunctionContext,
  QueryKey,
  UndefinedInitialDataOptions,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'

import { apiClient, type ApiError } from '../utils/apiClient'

type QueryOptionsWithCustomApiQueryFn<
  TBaseOptions extends object,
  TQueryFnData,
  TQueryKey extends QueryKey,
> = Omit<TBaseOptions, 'queryFn'> & {
  queryFn: (
    context: QueryFunctionContext<TQueryKey, never> & {
      apiClient: typeof apiClient
    },
  ) => TQueryFnData | Promise<TQueryFnData>
}

export default function useApiQuery<
  TQueryFnData = unknown,
  TError = ApiError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: QueryOptionsWithCustomApiQueryFn<
    UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    TQueryFnData,
    TQueryKey
  >,
  queryClient?: QueryClient,
): UseQueryResult<TData, TError>

export default function useApiQuery<
  TQueryFnData = unknown,
  TError = ApiError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: QueryOptionsWithCustomApiQueryFn<
    DefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>,
    TQueryFnData,
    TQueryKey
  >,
  queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError>

export default function useApiQuery<
  TQueryFnData = unknown,
  TError = ApiError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: QueryOptionsWithCustomApiQueryFn<
    UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>,
    TQueryFnData,
    TQueryKey
  >,
  queryClient?: QueryClient,
): UseQueryResult<TData, TError>

export default function useApiQuery<
  TQueryFnData = unknown,
  TError = ApiError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: QueryOptionsWithCustomApiQueryFn<
    UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    TQueryFnData,
    TQueryKey
  >,
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> {
  return useQuery(
    {
      ...options,
      queryFn: async (queryFnArgs) => {
        const abortableApiClient = apiClient.extend({
          signal: queryFnArgs.signal,
        })
        return options.queryFn({
          ...queryFnArgs,
          apiClient: abortableApiClient,
        })
      },
    },
    queryClient,
  )
}
