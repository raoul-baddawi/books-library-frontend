import z from 'zod'

import type {
  FileSizeType,
  FileValidatorOptions,
  KeyValueObject,
  SizeUnit,
} from './types'

export function isPrimitive(
  value: unknown,
): value is number | string | boolean {
  return value !== Object(value)
}

export function isKeyValObject(value: unknown): value is KeyValueObject {
  return Object.prototype.toString.call(value) === '[object Object]'
}

export function valueOrNothing<T>(condition: boolean, value: T) {
  return condition ? value : undefined
}

export function isValidFileType(file: File, allowedFiles: string[]) {
  if (allowedFiles.length > 0) {
    const starTypes = allowedFiles
      .filter((type) => type.includes('*'))
      .map((type) => type?.split('/')[0])

    if (
      !starTypes.includes(file.type?.split('/')[0]) &&
      !allowedFiles.includes(file.type)
    )
      return false
  }

  return true
}
function formatFileSize(fileSize: number, unit: SizeUnit) {
  switch (unit) {
    case 'kb':
      return fileSize / 1024
    case 'mb':
      return fileSize / (1024 * 1024)
    case 'gb':
      return fileSize / (1024 * 1024 * 1024)
  }
}
export function isFileExceedingMaxSize(file: File, maxSize: FileSizeType) {
  const maxSizeValue = Number(maxSize.slice(0, -2))
  const maxSizeUnit = maxSize.slice(-2) as SizeUnit
  const fileSize = formatFileSize(file.size, maxSizeUnit)

  return fileSize > maxSizeValue
}

export function isFileBelowMinSize(file: File, minSize: FileSizeType) {
  const minSizeValue = Number(minSize.slice(0, -2))
  const minSizeUnit = minSize.slice(-2) as SizeUnit
  const fileSize = formatFileSize(file.size, minSizeUnit)

  return fileSize < minSizeValue
}

export const getUrlWithoutLastUnderscore = (url: string) => {
  const filename = url?.split('/').pop() || ''
  const lastUnderscore = filename.lastIndexOf('_')
  const lastDot = filename.lastIndexOf('.')
  if (lastUnderscore !== -1 && lastDot !== -1 && lastUnderscore < lastDot) {
    return filename.substring(0, lastUnderscore) + filename.substring(lastDot)
  }
  return filename
}

export function zodFilesValidator(
  options?: FileValidatorOptions,
  messages?: {
    errorMessage?: string
    minimumFilesMessage?: string
    maximumFilesMessage?: string
  },
) {
  const { errorMessage, minimumFilesMessage, maximumFilesMessage } =
    messages || {}
  return z
    .custom<
      FileList | File[] | string[] | (File | string)[] | undefined | null
    >()
    .superRefine((fileList, ctx) => {
      if (!fileList || (fileList.length === 0 && options?.required)) {
        if (options?.required) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: errorMessage || 'Photos are required',
          })
        }

        return z.NEVER
      }

      const filesArray =
        fileList instanceof FileList ? Array.from(fileList) : fileList

      // Count total items (both Files and URLs)
      const totalCount = filesArray.length

      if (options?.minCount !== undefined && totalCount < options.minCount) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            minimumFilesMessage ||
            `At least ${options.minCount} file(s) are required`,
        })
      }

      if (options?.maxCount !== undefined && totalCount > options.maxCount) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            maximumFilesMessage ||
            `File(s) cannot exceed ${options.maxCount} in total`,
        })
      }

      filesArray.forEach((file, i) => {
        const issuePath = [...ctx.path, i]

        // If it's a string (URL), skip File-specific validations
        if (typeof file === 'string') {
          // URL strings are valid, no additional checks needed
          return
        }

        // For File objects, perform file-specific validations
        if (file === null || !(file instanceof File)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: errorMessage || 'Photo is invalid',
            fatal: true,
            path: issuePath,
          })

          return z.NEVER
        }

        if (!isValidFileType(file, options?.allowedFiles || [])) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `File type ${file.type} is not allowed`,
            path: issuePath,
          })
        }

        if (
          options?.minSize !== undefined &&
          isFileBelowMinSize(file, options.minSize)
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `File must be at least ${options.minSize}MB`,
            path: issuePath,
          })
        }

        if (
          options?.maxSize !== undefined &&
          isFileExceedingMaxSize(file, options.maxSize)
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `File must be at most ${options.maxSize}MB`,
            path: issuePath,
          })
        }
      })
    })
}
