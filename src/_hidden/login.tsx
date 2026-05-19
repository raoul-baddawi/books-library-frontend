/* eslint-disable react-refresh/only-export-components */
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'
import { toast } from 'sonner'
import z from 'zod'

import useAppForm from '$/features/shared/forms/hooks/useAppForm'
import Button from '$/lib/components/ui/buttons/Button'
import useApiMutation from '$/lib/hooks/useApiMutation'
import { useAuth } from '$/lib/providers/AuthProvider'
import { apiClient } from '$/lib/utils/apiClient'

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
})
type LoginData = z.infer<typeof loginSchema>
export const Route = createFileRoute('/login')({
  component: Login,
})

function Login() {
  const router = useRouter()
  const { role } = useAuth()
  const queryClient = useQueryClient()
  const { mutate, isPending } = useApiMutation({
    mutationFn: (data: LoginData) => {
      return apiClient
        .post('auth/login', {
          json: data,
        })
        .json()
    },
    onSuccess: () => {
      toast.success('Login successful!')
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })

  const { handleFormSubmit, fields } = useAppForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    onSubmit: (data) => mutate(data),
  })

  const { TextInput, PasswordInput } = fields

  useEffect(() => {
    if (role) {
      if (role === 'ADMIN') {
        router.navigate({ to: '/users' })
      } else {
        router.navigate({ to: '/books' })
      }
    }
  }, [role, router])
  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleFormSubmit}
        className="w-full max-w-md p-6 rounded bg-white shadow flex flex-col gap-2"
      >
        <h2 className="mb-4 text-xl font-semibold">Login</h2>
        <div>
          <TextInput name="email" placeholder="Email" label="Email" />
        </div>
        <div>
          <PasswordInput
            name="password"
            placeholder="Password"
            label="Password"
          />
        </div>
        <Link
          className="text-sm text-primary! hover:underline inline-block"
          to="/Register"
        >
          Don't have an account? Register
        </Link>
        <Button
          isLoading={isPending}
          disabled={isPending}
          type="submit"
          className="w-full! mt-2"
        >
          Login
        </Button>
      </form>
    </div>
  )
}
