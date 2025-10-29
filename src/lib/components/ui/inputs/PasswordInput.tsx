import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

import { cn } from '$/lib/utils/styling'

interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  isInvalid?: boolean
  errorMessageId?: string
}

export default function PasswordInput({
  className,
  isInvalid,
  errorMessageId,
  ...inputProps
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  return (
    <div className="relative w-full">
      <input
        type={showPassword ? 'text' : 'password'}
        className={cn(
          'w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm outline-hidden duration-200 placeholder:text-grey focus-within:outline-primary focus:border-accent disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger focus:aria-invalid:border-accent',
          className,
        )}
        aria-invalid={isInvalid}
        aria-errormessage={
          isInvalid && errorMessageId ? errorMessageId : undefined
        }
        {...inputProps}
      />

      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="text-gray-500 absolute inset-y-0 right-0 flex items-center px-3 focus:outline-none"
        tabIndex={-1}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? (
          <EyeOff size={20} className="text-gray-400 hover:text-gray-600" />
        ) : (
          <Eye size={20} className="text-gray-400 hover:text-gray-600" />
        )}
      </button>
    </div>
  )
}
