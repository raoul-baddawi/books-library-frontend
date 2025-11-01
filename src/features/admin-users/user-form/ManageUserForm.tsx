import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from '@tanstack/react-router'
import { DefaultValues, FieldErrors } from 'react-hook-form'

import FormBox from '$/features/shared/delete-popup/FormBox'
import useAppForm from '$/features/shared/forms/hooks/useAppForm'
import Button from '$/lib/components/ui/buttons/Button'
import { USER_ROLES_SELECT_OPTIONS } from '$/lib/constants/select-options'

import { userFormSchema, UserFormType } from './validations'

export type UserFormProps = {
  defaultValues?: Partial<DefaultValues<UserFormType>>
  onSubmit?: (data: UserFormType) => void
  onInvalidSubmit?: (errors: FieldErrors<UserFormType>) => void
  isEditMode?: boolean
  isPending?: boolean
}
function ManageUserForm({
  defaultValues,
  isEditMode,
  isPending,
  onInvalidSubmit,
  onSubmit,
}: UserFormProps) {
  const router = useRouter()
  const { handleFormSubmit, fields } = useAppForm<UserFormType>({
    resolver: zodResolver(userFormSchema),
    defaultValues,
    onSubmit,
    onInvalidSubmit,
  })
  return (
    <form onSubmit={handleFormSubmit}>
      <FormBox className="w-full">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <fields.TextInput name="firstName" label="First Name" />
          </div>
          <div className="flex flex-col">
            <fields.TextInput label="Last Name" name="lastName" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <fields.TextInput name="email" label="Email" />
          </div>
          {/* In real world applications,
           you would want to handle password changes more securely, 
           we send a code to the user email, then the user would enter that code in a dedicated otp page, 
           if the code is correct,
           then we allow him to change the password with confirm password */}
          <div className="flex flex-col">
            <fields.TextInput
              label="Password"
              name="password"
              type="password"
            />
          </div>

          <div className="flex flex-col">
            <fields.ComboSelectInput
              label="Role"
              name="role"
              options={USER_ROLES_SELECT_OPTIONS}
            />
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <Button
            type="button"
            variant="btn-white"
            onClick={() => router.history.back()}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isPending} disabled={isPending}>
            {isEditMode ? 'Update' : 'Create'}
          </Button>
        </div>
      </FormBox>
    </form>
  )
}

export default ManageUserForm
