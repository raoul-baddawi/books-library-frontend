import useApiQuery from '../hooks/useApiQuery'
export type SelectOptionType = {
  label: string
  value: string
}
export function useGenreOptions() {
  return useApiQuery({
    queryKey: ['genre-options'],
    queryFn: async ({ apiClient }) =>
      await apiClient
        .get<Promise<SelectOptionType[]>>('books/genre-options')
        .json(),
  })
}
export function useAuthorsOptions() {
  return useApiQuery({
    queryKey: ['authors-options'],
    queryFn: async ({ apiClient }) =>
      await apiClient
        .get<Promise<SelectOptionType[]>>('users/select-options')
        .json(),
  })
}
