import { type Ref, useId, useRef, useState } from 'react'
import { Fragment } from 'react/jsx-runtime'
import type { FieldPath, FieldValues, Path, PathValue } from 'react-hook-form'
import { useOnClickOutside } from 'usehooks-ts'

import FileInput from '$/lib/components/ui/inputs/file-input-with-preview/FileInput'
import FileListPreview, {
  type OuterImage,
} from '$/lib/components/ui/inputs/file-input-with-preview/FileInputListPreview'
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
  defaultUrls?: OuterImage[]
  className?: string
  multiple?: boolean
  disabled?: boolean
  shouldUploadFiles?: boolean
  maxSize?: FileSizeType
  minSize?: FileSizeType
  allowedFiles?: string[]
  inputParentClassName?: string
  inputPlaceHolder?: string
  onFiles?: (files: FileList | File[] | OuterImage[]) => void
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
  const currentFiles = (form.watch(name) as FileList | OuterImage[]) || []

  const handleFilesChange = (files: FileList) => {
    if (multiple) {
      form.setValue(name, [...currentFiles, ...files] as PathValue<
        TFieldValues,
        TFieldName
      >)
      onFiles?.(files)
    } else {
      form.setValue(name, files as PathValue<TFieldValues, TFieldName>)
      onFiles?.(files)
    }
  }
  type PathV = PathValue<TFieldValues, TFieldName>

  const removedImagesIds: PathV[] =
    form.watch('removedImagesIds' as PathV) || []

  const handleRemoveExternalImage = (item: OuterImage) => {
    form.setValue(
      'removedImagesIds' as Path<TFieldValues>,
      [...removedImagesIds, item.id] as PathValue<
        TFieldValues,
        Path<TFieldValues>
      >,
    )
    form.setValue(
      name,
      (currentFiles as OuterImage[]).filter(
        (i: OuterImage) => i.url !== item.url,
      ) as PathValue<TFieldValues, Path<TFieldValues>>,
    )
  }
  const handleRemoveFile = (file: File | OuterImage | undefined) => {
    if (file)
      if (file instanceof File) {
        const newFiles = [...(currentFiles as FileList)].filter(
          (f: File) => f.name !== file.name,
        )
        form.setValue(name, newFiles as PathValue<TFieldValues, TFieldName>)
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
              isDraggingFile && 'scale-0 opacity-0',
            )}
          >
            {inputUIComponent}
          </div>
          <div
            className={cn(
              'relative flex items-center justify-center duration-150',
              !isDraggingFile && 'scale-0 opacity-0',
            )}
          >
            {inputUIOnDragComponent}
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
