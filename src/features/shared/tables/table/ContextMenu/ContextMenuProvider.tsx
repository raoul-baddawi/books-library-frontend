import { createContext, type PropsWithChildren } from 'react'

export type ContextMenuContextType = {
  handleClose: () => void
}

const ContextMenuContext = createContext<ContextMenuContextType>({
  handleClose: () => {},
})

export default function ContextMenuProvider({
  handleClose,
  children,
}: PropsWithChildren<ContextMenuContextType>) {
  return (
    <ContextMenuContext.Provider value={{ handleClose }}>
      {children}
    </ContextMenuContext.Provider>
  )
}
