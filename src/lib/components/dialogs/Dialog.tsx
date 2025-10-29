import { FocusScope } from '@radix-ui/react-focus-scope'
import { XIcon } from 'lucide-react'
import { Dialog as DialogPrimitive, VisuallyHidden } from 'radix-ui'
import type { PropsWithChildren } from 'react'

import ShadowButton from '../ui/buttons/ShadowButton'

type DialogBodyProps = {
  title?: string
  description?: string
  focusTrapped?: boolean
  onEscapeKeyDown?: DialogPrimitive.DialogContentProps['onEscapeKeyDown']
  onPointerDownOutside?: DialogPrimitive.DialogContentProps['onPointerDownOutside']
}

function DialogRoot({
  children,
  open,
  onOpenChange,
}: PropsWithChildren<{
  open: boolean
  onOpenChange: (open: boolean) => void
}>) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </DialogPrimitive.Root>
  )
}

const DialogTrigger = DialogPrimitive.Trigger

const DialogClose = DialogPrimitive.Close

function DialogBody({
  title,
  description,
  focusTrapped,
  children,
  onEscapeKeyDown,
  onPointerDownOutside,
}: PropsWithChildren<DialogBodyProps>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-300 bg-black/50 data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in" />
      <DialogPrimitive.Overlay className="fixed inset-0 z-300 grid place-items-center overflow-y-auto data-[state=closed]:animate-fade-out">
        <FocusScope trapped={focusTrapped} asChild>
          <DialogPrimitive.Content
            onEscapeKeyDown={onEscapeKeyDown}
            onPointerDownOutside={onPointerDownOutside}
            className="z-300 my-12 w-[90vw] max-w-[1020px] rounded-md bg-white p-6 shadow-lg focus:outline-none data-[state=closed]:animate-modal-exit data-[state=open]:animate-modal-entrance"
          >
            <VisuallyHidden.Root asChild>
              <DialogPrimitive.Title>Dialog title</DialogPrimitive.Title>
            </VisuallyHidden.Root>
            {!!(title || description) && (
              <div className="mb-4">
                {title && (
                  <DialogPrimitive.Title asChild>
                    <h2 className="text-xl font-semibold">{title}</h2>
                  </DialogPrimitive.Title>
                )}
                {description && (
                  <DialogPrimitive.Description asChild>
                    <p className="text-sm font-normal text-neutral-medium">
                      {description}
                    </p>
                  </DialogPrimitive.Description>
                )}
              </div>
            )}

            <DialogPrimitive.Close asChild>
              <ShadowButton className="absolute top-2 right-2 flex size-9 items-center justify-center rounded-full">
                <XIcon />
              </ShadowButton>
            </DialogPrimitive.Close>

            {children}
          </DialogPrimitive.Content>
        </FocusScope>
      </DialogPrimitive.Overlay>
    </DialogPrimitive.Portal>
  )
}

function RawDialogBody({
  title,
  description,
  focusTrapped,
  children,
  onEscapeKeyDown,
  onPointerDownOutside,
}: PropsWithChildren<DialogBodyProps>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-300 bg-black/50 data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in" />
      <DialogPrimitive.Overlay className="fixed inset-0 z-300 grid place-items-center overflow-y-auto data-[state=closed]:animate-fade-out">
        <FocusScope trapped={focusTrapped} asChild>
          <DialogPrimitive.Content
            onEscapeKeyDown={onEscapeKeyDown}
            onPointerDownOutside={onPointerDownOutside}
            className="z-300 my-12 max-w-[820px] data-[state=closed]:animate-modal-exit data-[state=open]:animate-modal-entrance"
          >
            <div className="sr-only">
              <DialogPrimitive.Title>{title}</DialogPrimitive.Title>
              <DialogPrimitive.Description>
                {description}
              </DialogPrimitive.Description>
            </div>

            {children}
          </DialogPrimitive.Content>
        </FocusScope>
      </DialogPrimitive.Overlay>
    </DialogPrimitive.Portal>
  )
}

const Dialog = {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Close: DialogClose,
  Body: DialogBody,
  RawBody: RawDialogBody,
}

export default Dialog
