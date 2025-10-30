import useApiMutation from '$/lib/hooks/useApiMutation'
import { apiClient } from '$/lib/utils/apiClient'

async function setDeleted({ url }: { url: string }) {
  return apiClient.post(url)
}

export default function useDeleteItem(mutationKey: string[]) {
  return useApiMutation({
    mutationFn: setDeleted,
    mutationKey: mutationKey,
  })
}
