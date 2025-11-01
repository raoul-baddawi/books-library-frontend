import {
  type ComponentProps,
  forwardRef,
  useId,
  useImperativeHandle,
  useRef,
} from 'react'

import useGlobalPaste from '$/lib/hooks/useGlobalPaste'
import {
  isFileBelowMinSize,
  isFileExceedingMaxSize,
  isValidFileType,
} from '$/lib/utils/functions'
import { cn } from '$/lib/utils/styling'
import type { FileSizeType } from '$/lib/utils/types'

type Props = Omit<ComponentProps<'input'>, 'type'> & {
  minSize?: FileSizeType
  maxSize?: FileSizeType
  allowedFiles?: string[]
  allowGlobalPaste?: boolean
  allowDragAndDrop?: boolean
  skipFileTypesValidation?: boolean
  skipMinSizeValidation?: boolean
  skipMaxSizeValidation?: boolean
  excludeInvalidFiles?: boolean
  onInvalidFileType?: (file: File, index: number) => void
  onBelowMinSize?: (file: File, index: number) => void
  onExceedMaxSize?: (file: File, index: number) => void
  onGlobalPaste?: (e: ClipboardEvent) => void
  onFiles: (file: FileList) => void
}

const FileInput = forwardRef<HTMLInputElement, Props>(
  (
    {
      name,
      multiple,
      minSize,
      maxSize,
      allowedFiles,
      allowGlobalPaste,
      allowDragAndDrop,
      skipFileTypesValidation,
      skipMinSizeValidation,
      skipMaxSizeValidation,
      excludeInvalidFiles,
      onDragEnter: onDragEnterProp,
      onDragOver: onDragOverProp,
      onDrop: onDropProp,
      onChange: onChangeProp,
      onInvalidFileType,
      onBelowMinSize,
      onExceedMaxSize,
      onGlobalPaste,
      className,
      onFiles,
      ...inputProps
    },
    forwardedRef,
  ) => {
    const internalRef = useRef<HTMLInputElement>(null)

    const hookId = useId()
    const id = inputProps.id || hookId

    useImperativeHandle<HTMLInputElement | null, HTMLInputElement | null>(
      forwardedRef,
      () => internalRef.current,
    )

    const handleFileChangeHelper = (fileList: FileList | undefined | null) => {
      if (!fileList) return

      const invalidFileIndices: number[] = []
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList.item(i) as File
        let isValid = true

        if (
          !skipFileTypesValidation &&
          !isValidFileType(file, allowedFiles || [])
        ) {
          onInvalidFileType?.(file, i)
          isValid = false
        }

        if (
          !skipMinSizeValidation &&
          minSize !== undefined &&
          isFileBelowMinSize(file, minSize)
        ) {
          onBelowMinSize?.(file, i)
          isValid = false
        }

        if (
          !skipMaxSizeValidation &&
          maxSize !== undefined &&
          isFileExceedingMaxSize(file, maxSize)
        ) {
          onExceedMaxSize?.(file, i)
          isValid = false
        }

        if (!isValid) {
          invalidFileIndices.push(i)
        }
      }

      if (excludeInvalidFiles) {
        const dataTransfer = new DataTransfer()

        Array.from(fileList).forEach((file, index) => {
          if (!invalidFileIndices.includes(index)) {
            dataTransfer.items.add(file)
          }
        })

        const missingFiles = Array.from(fileList).filter(
          (_, index) => !dataTransfer.files[index],
        )

        if (missingFiles.length > 0) {
          const invalidFileNames = missingFiles
            .map((file) => file.name)
            .join(', ')
          const errorMessage = `Les fichiers suivants sont invalides : ${invalidFileNames}`
          console.error(errorMessage)
        }

        onFiles(dataTransfer.files)
        return
      }

      onFiles(fileList)
    }

    useGlobalPaste((e) => {
      if (allowGlobalPaste) {
        onGlobalPaste?.(e)
        handleFileChangeHelper(e.clipboardData?.files)
      }
    })

    const onDrop: React.DragEventHandler<HTMLInputElement> = (e) => {
      onDropProp?.(e)
      e.preventDefault()
      e.stopPropagation()
      if (allowDragAndDrop) {
        handleFileChangeHelper(e.dataTransfer.files)
      }
    }

    const onDragEnter: React.DragEventHandler<HTMLInputElement> = (e) => {
      onDragEnterProp?.(e)
      e.preventDefault()
      e.stopPropagation()
    }

    const onDragOver: React.DragEventHandler<HTMLInputElement> = (e) => {
      onDragOverProp?.(e)
      e.preventDefault()
      e.stopPropagation()
    }

    const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
      onChangeProp?.(e)
      handleFileChangeHelper(e.target.files)
    }

    return (
      <div className={cn('flex w-full', className)}>
        <input
          type="file"
          ref={internalRef}
          id={id}
          name={name}
          multiple={multiple}
          onDrop={onDrop}
          onChange={onChange}
          accept={allowedFiles?.join(',')}
          onDragOver={onDragOver}
          onDragEnter={onDragEnter}
          className={className}
          {...inputProps}
        />
      </div>
    )
  },
)

FileInput.displayName = 'FileInput'

export default FileInput
