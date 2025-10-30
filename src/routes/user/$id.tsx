import EditUser from '$/features/admin-users/user-form/EditUser'
import { UserFormType } from '$/features/admin-users/user-form/validations'
import useApiQuery from '$/lib/hooks/useApiQuery'
import { decodeId } from '$/lib/utils/misc'
import { createFileRoute, useParams } from '@tanstack/react-router'

export const Route = createFileRoute('/user/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = useParams({ from: '/user/$id' })
  const decodedId = decodeId(id)
  const { data } = useApiQuery({
    queryKey: ['user-detail', decodedId],
    queryFn: async ({ apiClient }) =>
      await apiClient.get<UserFormType>(`users/${decodedId}`).json(),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  })

  return (
    <div className="w-full p-4 bg-white h-full gap-6 flex flex-col">
      <h1 className="text-4xl font-bold">Edit User</h1>
      <EditUser id={decodedId!} data={data} />
    </div>
  )
}
