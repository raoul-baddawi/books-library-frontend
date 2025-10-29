import { createFileRoute, useRouter } from '@tanstack/react-router'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'

import useAppForm from '$/features/shared/forms/hooks/useAppForm'
import Button from '$/lib/components/ui/buttons/Button'
import { useAuth } from '$/lib/providers/AuthProvider'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const Route = createFileRoute('/signup')({
  component: Signup,
})

function Signup() {
  const { setUser } = useAuth<true>()
  const router = useRouter()

  const { handleFormSubmit, fields } = useAppForm<{
    email: string
    password: string
  }>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
    onSubmit: (data) => {
      const role = data.email.includes('admin') ? 'ADMIN' : 'AUTHOR'
      setUser({ id: '2', username: data.email, role: role as any, books: [] })
      if (role === 'ADMIN') {
        ;(router as any).navigate({ to: '/users' })
      } else {
        ;(router as any).navigate({ to: '/books' })
      }
    },
  })

  const { TextInput: FI } = fields

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleFormSubmit}
        className="w-full max-w-md p-6 rounded bg-white shadow"
      >
        <h2 className="mb-4 text-xl font-semibold">Sign up</h2>
        <FI name="email" placeholder="Email" />
        <div className="h-2" />
        <FI name="password" type="password" placeholder="Password" />
        <div className="h-4" />
        <Button type="submit">Create account</Button>
      </form>
    </div>
  )
}
