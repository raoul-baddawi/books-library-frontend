import { createFileRoute, useRouter } from '@tanstack/react-router'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'

import useAppForm from '$/features/shared/forms/hooks/useAppForm'
import Button from '$/lib/components/ui/buttons/Button'
import { apiClient } from '$/lib/utils/apiClient'
import useApiMutation from '$/lib/hooks/useApiMutation'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '$/lib/providers/AuthProvider'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const Route = createFileRoute('/login')({
  component: Login,
})

function Login() {
  const router = useRouter()
  const { role } = useAuth()
  const queryClient = useQueryClient()
  const { mutate, isPending } = useApiMutation({
    mutationFn: (data: { email: string; password: string }) => {
      return apiClient
        .post('auth/login', {
          json: data,
        })
        .json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
      // redirect based on role
      if (role) {
        if (role === 'ADMIN') {
          router.navigate({ to: '/users' })
        } else {
          router.navigate({ to: '/books' })
        }
      } else {
        router.navigate({ to: '/' })
      }
    },
  })
  const { handleFormSubmit, fields } = useAppForm<{
    email: string
    password: string
  }>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
    onSubmit: (data) => mutate(data),
  })

  const { TextInput: FI } = fields

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleFormSubmit}
        className="w-full max-w-md p-6 rounded bg-white shadow"
      >
        <h2 className="mb-4 text-xl font-semibold">Login</h2>
        <FI name="email" placeholder="Email" />
        <div className="h-2" />
        <FI name="password" type="password" placeholder="Password" />
        <div className="h-4" />
        <Button isLoading={isPending} disabled={isPending} type="submit">
          Login
        </Button>
      </form>
    </div>
  )
}
