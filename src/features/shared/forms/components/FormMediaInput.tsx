import { type Ref, useId, useRef, useState } from 'react'
import { Fragment } from 'react/jsx-runtime'
import type { FieldPath, FieldValues, Path, PathValue } from 'react-hook-form'
import { useOnClickOutside } from 'usehooks-ts'

import FileInput from '$/lib/components/ui/inputs/file-input-with-preview/FileInput'
import FileListPreview from '$/lib/components/ui/inputs/file-input-with-preview/FileInputListPreview'
import InputError from '$/lib/components/ui/inputs/InputError'
import Label from '$/lib/components/ui/inputs/Label'
import { cn } from '$/lib/utils/styling'
import type { FileSizeType } from '$/lib/utils/types'

import type { FormInputCleanComponentProps, FormInputProps } from '../types'

export type FileInputUiProps = {
  inputUIComponent?: React.ReactNode
  inputUIOnDragComponent?: React.ReactNode
}
type FileInputProps = {
  defaultUrls?: string[]
  className?: string
  multiple?: boolean
  disabled?: boolean
  shouldUploadFiles?: boolean
  maxSize?: FileSizeType
  minSize?: FileSizeType
  allowedFiles?: string[]
  inputParentClassName?: string
  inputPlaceHolder?: string
  onFiles?: (files: FileList | File[] | string[]) => void
} & FileInputUiProps

interface FormFileInputProps<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TContext = any,
  TTransformedValues = TFieldValues,
> extends FormInputProps<
      TFieldValues,
      TFieldName,
      TContext,
      TTransformedValues
    >,
    FormInputCleanComponentProps<FileInputProps> {}

export default function FormFileInput<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TContext = any,
  TTransformedValues = TFieldValues,
>({
  form,
  name,
  label,
  defaultUrls = [],
  multiple = false,
  disabled = false,
  shouldUploadFiles = false,
  maxSize,
  minSize,
  allowedFiles,
  inputParentClassName,
  inputUIComponent,
  inputUIOnDragComponent,
  onFiles,
  ...fileInputProps
}: FormFileInputProps<TFieldValues, TFieldName, TContext, TTransformedValues>) {
  const errorMessageId = useId()
  const fieldState = form.getFieldState(name)
  const inputErrorVisible = fieldState.invalid && !!fieldState.error?.message
  const [isDraggingFile, setIsDraggingFile] = useState(false)
  const refDiv = useRef<HTMLElement>(null!)
  const inputRef = useRef<HTMLInputElement>(null)
  const handleContainerClick = () => {
    if (!disabled && !form.formState.isSubmitting) {
      const input = inputRef.current
      if (input) input.click()
    }
  }
  const currentFiles = (form.watch(name) as (File | string)[]) || []

  const handleFilesChange = (files: FileList) => {
    if (multiple) {
      form.setValue(
        name,
        [...currentFiles, ...files] as PathValue<TFieldValues, TFieldName>,
        { shouldDirty: true },
      )
      onFiles?.(files)
    } else {
      form.setValue(name, files as PathValue<TFieldValues, TFieldName>, {
        shouldDirty: true,
      })
      onFiles?.(files)
    }
  }

  const removedImagesIds: string[] =
    (form.watch('removedImagesIds' as Path<TFieldValues>) as string[]) || []

  const handleRemoveExternalImage = (item: string) => {
    const imageId = item

    form.setValue(
      'removedImagesIds' as Path<TFieldValues>,
      [...removedImagesIds, imageId] as PathValue<
        TFieldValues,
        Path<TFieldValues>
      >,
      { shouldDirty: true },
    )
    form.setValue(
      name,
      (currentFiles as (File | string)[]).filter(
        (url: File | string) => url !== item,
      ) as PathValue<TFieldValues, Path<TFieldValues>>,
      { shouldDirty: true },
    )
  }
  const handleRemoveFile = (file: File | string | undefined) => {
    if (file)
      if (file instanceof File) {
        const newFiles = [...(currentFiles as (File | string)[])].filter(
          (f: File | string) => f !== file,
        )
        form.setValue(name, newFiles as PathValue<TFieldValues, TFieldName>, {
          shouldDirty: true,
        })
      } else {
        handleRemoveExternalImage(file)
      }
  }

  const handleExitDrag = () => {
    setIsDraggingFile(false)
  }

  useOnClickOutside(refDiv, () => {
    setIsDraggingFile(false)
  })

  return (
    <Fragment>
      {!!label && <Label htmlFor={name}>{label}</Label>}
      <div
        className={cn(
          'relative cursor-pointer',
          inputParentClassName,
          inputErrorVisible && 'rounded-lg border border-red',
        )}
        ref={refDiv as Ref<HTMLDivElement>}
        onClick={handleContainerClick}
        onDragEnter={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setIsDraggingFile(true)
        }}
        onDragOver={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          e.stopPropagation()
          if (
            e.currentTarget === e.target ||
            !e.currentTarget.contains(e.relatedTarget as Node)
          ) {
            setIsDraggingFile(false)
          }
        }}
        onDrop={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setIsDraggingFile(false)

          const files = e.dataTransfer.files
          if (files && files.length > 0) {
            handleFilesChange(files)
          }
        }}
      >
        <FileInput
          ref={inputRef}
          disabled={disabled || form.formState.isSubmitting}
          name={name}
          multiple={multiple}
          allowedFiles={allowedFiles}
          minSize={minSize}
          maxSize={maxSize}
          excludeInvalidFiles={true}
          onDragEnter={() => setIsDraggingFile(true)}
          onDragLeave={handleExitDrag}
          onDrop={handleExitDrag}
          onFiles={handleFilesChange}
          allowDragAndDrop
          allowGlobalPaste
          {...fileInputProps}
          className="peer absolute inset-0 opacity-0"
        />
        <div className="w-full">
          <div
            className={cn(
              'relative flex items-center justify-center duration-150',
            )}
          >
            {isDraggingFile ? inputUIOnDragComponent : inputUIComponent}
          </div>
        </div>
      </div>
      {inputErrorVisible && (
        <InputError
          id={errorMessageId}
          message={fieldState.error!.message as string}
        />
      )}
      <FileListPreview
        form={form}
        onFiles={onFiles}
        handleSetRemoveFile={handleRemoveFile}
        files={currentFiles}
        disabled={disabled || form.formState.isSubmitting}
        defaultUrls={defaultUrls}
        name={name}
        handleRemoveExternalImage={handleRemoveExternalImage}
        shouldUploadFiles={shouldUploadFiles}
      />
    </Fragment>
  )
}
