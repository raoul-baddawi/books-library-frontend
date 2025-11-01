import { DefaultValues, FieldErrors } from 'react-hook-form'
import { bookFormSchema, BookFormType } from './validations'
import FormBox from '$/features/shared/delete-popup/FormBox'
import useAppForm from '$/features/shared/forms/hooks/useAppForm'
import { zodResolver } from '@hookform/resolvers/zod'
import Button from '$/lib/components/ui/buttons/Button'
import { useRouter } from '@tanstack/react-router'
import { SelectOptionType } from '$/lib/api-hooks/api-select-options'
import FileInputUiComponent from '$/lib/components/ui/FileInputUiComponent'
import DragDropFileInputComponent from '$/lib/components/ui/DragDropFileInputComponent'

export type BookFormProps = {
  defaultValues?: Partial<DefaultValues<BookFormType>>
  onSubmit?: (data: BookFormType) => void
  onInvalidSubmit?: (errors: FieldErrors<BookFormType>) => void
  isEditMode?: boolean
  isPending?: boolean
  authorsOptions?: SelectOptionType[]
  genreOptions?: SelectOptionType[]
  isGenrePending?: boolean
  isAuthorsPending?: boolean
}
function ManageBookForm({
  defaultValues,
  isEditMode,
  isPending,
  onInvalidSubmit,
  onSubmit,
  authorsOptions,
  genreOptions,
  isGenrePending,
  isAuthorsPending,
}: BookFormProps) {
  const router = useRouter()
  const { handleFormSubmit, fields } = useAppForm<BookFormType>({
    resolver: zodResolver(bookFormSchema),
    defaultValues,
    onSubmit,
    onInvalidSubmit,
  })
  return (
    <form onSubmit={handleFormSubmit} className="w-full">
      <FormBox className="w-full">
        <div className="grid grid-cols-1 gap-4 w-full">
          <div className="flex flex-col">
            <fields.TextInput name="name" label="Name" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 w-full">
          <div className="flex flex-col">
            <fields.TextAreaInput
              label="Description"
              name="description"
              className="resize-y"
              minRows={4}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <div className="flex flex-col">
            <fields.ComboSelectInput
              name="genre"
              label="Genre"
              autoAddOptions
              autoComplete
              options={genreOptions}
              disabled={isGenrePending}
            />
          </div>

          <div className="flex flex-col">
            <fields.ComboSelectInput
              label="Author"
              name="authorId"
              autoComplete
              options={authorsOptions}
              disabled={isAuthorsPending}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 w-full">
          <div className="flex flex-col">
            <fields.MediaInput
              name="media"
              disabled={isPending}
              className="h-fit w-full"
              multiple
              inputUIOnDragComponent={<DragDropFileInputComponent isDragging />}
              inputUIComponent={<FileInputUiComponent />}
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

export default ManageBookForm
