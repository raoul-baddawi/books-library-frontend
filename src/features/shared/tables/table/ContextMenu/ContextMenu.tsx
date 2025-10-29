import { forwardRef, PropsWithChildren } from 'react'

import { cn } from '$/lib/utils/styling'

import ContextMenuProvider from './ContextMenuProvider'

type ContextMenuProps = {
  handleCloseMenu: () => void
}

const ContextMenu = forwardRef<
  HTMLDivElement,
  PropsWithChildren<ContextMenuProps>
>(function ContextMenu(
  { children, handleCloseMenu }: PropsWithChildren<ContextMenuProps>,
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        'fixed top-1/2 left-1/2 z-52 min-w-[220px] -translate-x-1/2 -translate-y-1/2 p-[5px]',
      )}
    >
      <ContextMenuProvider handleClose={handleCloseMenu}>
        {children}
      </ContextMenuProvider>
    </div>
  )
})

export default ContextMenu
