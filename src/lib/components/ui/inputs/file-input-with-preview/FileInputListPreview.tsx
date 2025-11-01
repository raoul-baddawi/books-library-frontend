import { XIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { FieldValues, Path, UseFormReturn } from 'react-hook-form'

import Dialog from '$/lib/components/dialogs/Dialog'
import { getUrlWithoutLastUnderscore } from '$/lib/utils/functions'
import { cn } from '$/lib/utils/styling'

import ImagePContainer from './ImagePContainer'
import PdfIcon from './PdfIcon'
import TrashIcon from './TrashIcon'

type FileListPreviewProps<
  TFieldValues extends FieldValues = FieldValues,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TContext = any,
  TTransformedValues = TFieldValues,
> = {
  files?: FileList | string[] | (File | string)[] | undefined
  defaultUrls?: string[]
  onFiles?: (files: FileList | File[] | string[]) => void
  handleSetRemoveFile?: (file: File | string | undefined) => void
  handleRemoveExternalImage?: (item: string) => void
  name?: string
  disabled?: boolean
  shouldUploadFiles?: boolean
  primaryMappedOptionClassname?: string
  secondaryMappedOptionClassname?: string
  innerPrimaryClassname?: string
  form: UseFormReturn<TFieldValues, TContext, TTransformedValues>
}

const FileListPreview = <
  TFieldValues extends FieldValues = FieldValues,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TContext = any,
  TTransformedValues = TFieldValues,
>({
  files = [],
  onFiles,
  handleSetRemoveFile,
  handleRemoveExternalImage,
  defaultUrls = [],
  name,
  disabled,
  shouldUploadFiles = false,
  primaryMappedOptionClassname,
  secondaryMappedOptionClassname,
  innerPrimaryClassname,
  form,
}: FileListPreviewProps<TFieldValues, TContext, TTransformedValues>) => {
  const [combinedImages, setCombinedImages] = useState<(File | string)[]>([])
  const [expandedImage, setExpandedImage] = useState<string | null>(null)
  const [uploadProgress] = useState<
    Record<
      string,
      { progress: number; isDone: boolean; loaded: number; total: number }
    >
  >({})
  const initialCombinedImagesRef = useRef<(File | string)[]>([])
  const hasInitialized = useRef(false)

  const areArraysEqual = (arr1: (File | string)[], arr2: (File | string)[]) => {
    if (arr1.length !== arr2.length) return false
    return arr1.every((item, index) =>
      item instanceof File && arr2[index] instanceof File
        ? item.name === (arr2[index] as File).name
        : item === arr2[index],
    )
  }

  useEffect(() => {
    if (!name) {
      const filesArray: (File | string)[] =
        files instanceof FileList
          ? Array.from(files)
          : Array.isArray(files)
            ? files
            : []
      const urlsToAdd = defaultUrls.filter((url) => !filesArray.includes(url))
      const initialCombinedImages = [...filesArray, ...urlsToAdd]

      if (
        !areArraysEqual(initialCombinedImagesRef.current, initialCombinedImages)
      ) {
        initialCombinedImagesRef.current = initialCombinedImages
        setCombinedImages(initialCombinedImages)
      }
    } else if (!hasInitialized.current) {
      hasInitialized.current = true
      const formFiles =
        (form.getValues(name as Path<TFieldValues>) as (File | string)[]) || []

      if (formFiles.length > 0) {
        setCombinedImages(formFiles)
      }
    }
  }, [files, defaultUrls, name, form])

  useEffect(() => {
    if (name) {
      const subscription = form.watch((value, { name: fieldName }) => {
        if (!name || fieldName !== name) return
        const formFiles = (value[name] as (File | string)[]) || []

        setCombinedImages(formFiles)
      })
      return () => subscription.unsubscribe()
    }
  }, [form, name])

  const expandImage = (url: string) => {
    setExpandedImage(url)
  }

  const closeExpandedImage = () => {
    setExpandedImage(null)
  }

  const handleRemoveFile = (file: File | string) => {
    handleSetRemoveFile?.(file)
    if (file && name) {
      form.setValue(
        name as Path<TFieldValues>,
        form
          .getValues(name as Path<TFieldValues>)
          .filter((f: File) => f !== file),
      )
    }
    onFiles?.([file] as File[])
  }

  const isImageFile = (file: File | string) => {
    if (file instanceof File) {
      return file.type.startsWith('image/')
    }
    if (file)
      return (
        file.endsWith('.jpg') ||
        file.endsWith('.jpeg') ||
        file.endsWith('.png') ||
        file.endsWith('.gif')
      )

    return false
  }

  const isPdfFile = (file: File | string) => {
    if (file instanceof File) {
      return file.type === 'application/pdf'
    }
    if (file) return file.endsWith('.pdf')
    return false
  }

  if (!combinedImages || combinedImages.length === 0) return null

  return (
    <div className="mt-2 flex w-full flex-col gap-2">
      <div className="flex max-h-60 w-full flex-wrap gap-2 overflow-y-auto">
        {combinedImages?.map((item, index) => (
          <Dialog.Root
            key={index}
            open={!!expandedImage}
            onOpenChange={closeExpandedImage}
          >
            <div
              key={index}
              className={cn(
                'relative w-fit shrink-0 overflow-hidden rounded-xl border border-neutral-medium/50',
                primaryMappedOptionClassname,
              )}
            >
              {isImageFile(item) ? (
                <ImagePContainer
                  expandImage={expandImage}
                  handleRemoveFile={handleRemoveFile}
                  index={index}
                  item={item}
                  disabled={disabled}
                />
              ) : isPdfFile(item) ? (
                <div
                  className={cn(
                    'flex h-full flex-col gap-1',
                    secondaryMappedOptionClassname,
                  )}
                >
                  <div
                    className={cn(
                      'rounded-12 flex h-full items-center gap-2 p-2 peer-hover:border-secondary',
                      innerPrimaryClassname,
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        if (item instanceof File) {
                          window.open(URL.createObjectURL(item))
                        } else if (item?.length) {
                          const url = !item.includes(
                            import.meta.env.VITE_IMAGES_BASE_URL,
                          )
                            ? `${import.meta.env.VITE_IMAGES_BASE_URL}/${item}`
                            : item
                          window.open(url)
                        }
                      }}
                    >
                      <PdfIcon className="h-6 w-6" fill="#C1093E" />
                    </button>
                    <p className="text-xs font-semibold text-neutral-medium">
                      {item instanceof File
                        ? item.name.length > 20
                          ? `${item.name.substring(0, 20)}...${item.name.substring(item.name.length - 6)}`
                          : item.name
                        : getUrlWithoutLastUnderscore(item)}
                    </p>
                    {!disabled && (
                      <button
                        className="ml-auto flex h-fit"
                        type="button"
                        onClick={() => {
                          if (item instanceof File) handleRemoveFile(item)
                          else {
                            handleRemoveExternalImage?.(item)
                            if (name) {
                              form.setValue(
                                name as Path<TFieldValues>,
                                form
                                  .getValues(name as Path<TFieldValues>)
                                  .filter((f: string) => f !== item),
                              )
                              onFiles?.([item] as string[])
                            }
                          }
                        }}
                      >
                        <TrashIcon
                          className="h-4 w-4 shrink-0"
                          fill="#C1093E"
                        />
                      </button>
                    )}
                  </div>
                  {shouldUploadFiles &&
                    item instanceof File &&
                    uploadProgress[(item as File).name] &&
                    !uploadProgress[(item as File).name].isDone && (
                      <div className="mx-auto flex w-full flex-col gap-2 p-2">
                        <p className="mt-1 flex items-center gap-2 text-sm text-neutral-medium">
                          <p className="text-xs">
                            Uploading...
                            {` ${uploadProgress[(item as File).name] ? uploadProgress[(item as File).name].progress : 0}%`}
                          </p>
                          <div
                            className="h-3 w-3 animate-spin rounded-full border-2 border-solid border-secondary border-t-transparent"
                            role="status"
                          ></div>
                          <span className="text-xs text-neutral-light">
                            {uploadProgress[(item as File).name].loaded &&
                              uploadProgress[(item as File).name].total && (
                                <>
                                  {`${Math.round(
                                    uploadProgress[(item as File).name].loaded /
                                      1024,
                                  )} Ko sur ${Math.round(
                                    uploadProgress[(item as File).name].total /
                                      1024,
                                  )} Ko`}
                                </>
                              )}
                          </span>
                        </p>
                        <div className="mt-2 h-2 w-full rounded-full bg-neutral-light">
                          <div
                            className="h-2 rounded-full bg-secondary"
                            style={{
                              width: `${uploadProgress[(item as File).name].progress || 0}%`,
                              transition: 'width 0.5s ease-in-out',
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                </div>
              ) : item instanceof File ? (
                <p className="mx-auto flex h-full w-[60%] items-center justify-center text-center text-sm text-neutral-medium">
                  Unsupported file type
                </p>
              ) : (
                item &&
                item.includes('https') && (
                  <ImagePContainer
                    expandImage={expandImage}
                    handleRemoveFile={handleRemoveFile}
                    index={index}
                    item={item}
                    disabled={disabled}
                  />
                )
              )}
            </div>

            <Dialog.RawBody title="Image Preview" description="Click to close">
              <Dialog.Close asChild>
                <button className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full border border-black bg-white p-1">
                  <XIcon />
                </button>
              </Dialog.Close>

              <img
                src={expandedImage || undefined}
                alt="Expanded"
                className="h-full max-h-[80vh] w-full max-w-[50vw] object-contain transition-transform duration-300 ease-in-out"
                onClick={(e) => e.stopPropagation()}
              />
            </Dialog.RawBody>
          </Dialog.Root>
        ))}
      </div>
    </div>
  )
}

export default FileListPreview
