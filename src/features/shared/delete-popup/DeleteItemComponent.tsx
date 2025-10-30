import { Trash2 } from 'lucide-react'
import { useState } from 'react'

import DeleteItemModal, { DeleteItemModalProps } from './DeleteItemModal'

export default function DeleteItemComponent(props: DeleteItemModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="text-center">
      <button
        type="button"
        className="rounded-full bg-status-lightred p-1.5 text-status-warning"
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(true)
        }}
      >
        <Trash2 className="h-4 w-4" />
      </button>
      <DeleteItemModal {...props} open={isOpen} setOpen={setIsOpen} />
    </div>
  )
}
