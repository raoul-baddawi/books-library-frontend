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

import { loginSchema } from './login'

const registerSchema = loginSchema
  .extend({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    confirmPassword: z.string().min(1, 'Confirm Password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type RegisterData = z.infer<typeof registerSchema>
export const Route = createFileRoute('/Register')({
  component: Register,
})

function Register() {
  const router = useRouter()
  const { role } = useAuth()
  const queryClient = useQueryClient()
  const { mutate, isPending } = useApiMutation({
    mutationFn: (data: RegisterData) => {
      return apiClient
        .post('auth/register', {
          json: data,
        })
        .json()
    },
    onSuccess: () => {
      toast.success('Registration successful!')
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })

  const { handleFormSubmit, fields } = useAppForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      confirmPassword: '',
    },
    onSubmit: (data) => mutate(data),
  })

  const { TextInput, PasswordInput } = fields

  useEffect(() => {
    // In real world app, we redirect the user to an otp or a code verification page
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
        <h2 className="mb-4 text-xl font-semibold">Register</h2>
        <div>
          <TextInput
            name="firstName"
            placeholder="First Name"
            label="First Name"
          />
        </div>
        <div>
          <TextInput
            name="lastName"
            placeholder="Last Name"
            label="Last Name"
          />
        </div>
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
        <div>
          <PasswordInput
            name="confirmPassword"
            placeholder="Confirm Password"
            label="Confirm Password"
          />
        </div>
        <Link
          className="text-sm text-primary! hover:underline inline-block"
          to="/login"
        >
          Already have an account? Login
        </Link>
        <Button
          isLoading={isPending}
          disabled={isPending}
          type="submit"
          className="w-full! mt-2"
        >
          Register
        </Button>
      </form>
    </div>
  )
}
