import { useQueryClient } from '@tanstack/react-query'

import useDeleteItem from './api'
import FormBox from './FormBox'
import FormActionsButtons from './FormActionsButtons'
import Dialog from '$/lib/components/dialogs/Dialog'
import { toast } from 'sonner'

export type DeleteItemModalProps = {
  url: string
  title: string
  description?: string
  invalidateKeys: string[]
  mutationKey: string[]
}

export default function DeleteItemModal({
  open,
  setOpen,
  url,
  title,
  description,
  invalidateKeys,
  mutationKey,
}: DeleteItemModalProps & {
  open: boolean
  setOpen: (open: boolean) => void
}) {
  const queryClient = useQueryClient()
  const { mutateAsync, isPending: isPendingMutate } = useDeleteItem(mutationKey)
  const handleSubmitDelete = async () => {
    mutateAsync({
      url,
    })
      .then(async () => {
        await queryClient.invalidateQueries({
          predicate: (query) =>
            invalidateKeys.includes(query.queryKey[0] as string),
        })
        toast.success('Item deleted successfully')
        setOpen(false)
      })
      .catch(() => {
        toast.error('Failed to delete the item')
      })
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Body>
        <FormBox
          contentClassName="gap-5"
          className="w-full min-w-[700px] bg-white p-0"
          title={title}
        >
          <p className="text-sm font-semibold text-accent">{description}</p>

          <FormActionsButtons
            setOpen={() => setOpen(false)}
            onButtonClick={handleSubmitDelete}
            isPending={isPendingMutate}
            confirmClassName="!bg-status-warning !text-white"
            className="[&>button]:border-border [&>button]:text-neutral-dark"
            confirmText="Delete"
            type="button"
          />
        </FormBox>
      </Dialog.Body>
    </Dialog.Root>
  )
}
