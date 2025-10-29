import { useEffect, useState } from 'react'

import { getUrlWithoutLastUnderscore } from '$/lib/utils/functions'

import type { OuterImage } from './FileInputListPreview'
import TrashIcon from './TrashIcon'

type Props = {
  item: File | OuterImage
  index: number
  expandImage: (url: string) => void
  disabled?: boolean
  handleRemoveFile: (file: File) => void
}
const ImagePContainer = ({
  item,
  index,
  expandImage,
  disabled,
  handleRemoveFile,
}: Props) => {
  const [preview, setPreview] = useState<string | null>('')

  useEffect(() => {
    let objectURL: string | null = null

    if (item instanceof File) {
      objectURL = URL.createObjectURL(item)

      queueMicrotask(() => setPreview(objectURL))
    } else {
      queueMicrotask(() => setPreview(item.url))
    }

    return () => {
      if (objectURL) {
        URL.revokeObjectURL(objectURL)
      }
    }
  }, [item])

  return (
    <div className="rounded-12 flex h-full items-center gap-2 p-2">
      <img
        src={preview && preview.length ? preview : undefined}
        alt={`Preview ${index}`}
        className="h-[30px] w-[30px] cursor-pointer rounded-full object-cover"
        onClick={() => expandImage(preview ?? '')}
        loading="lazy"
      />
      <p className="text-xs font-semibold text-neutral-medium">
        {item instanceof File
          ? item.name.substring(0, 20)
          : getUrlWithoutLastUnderscore(item.url)}
      </p>
      {!disabled && (
        <button
          className="ml-auto flex h-fit cursor-pointer p-1"
          type="button"
          onClick={() => handleRemoveFile(item as File)}
        >
          <TrashIcon className="h-4 w-4 shrink-0" fill="#C1093E" />
        </button>
      )}
    </div>
  )
}

export default ImagePContainer
