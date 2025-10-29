import type { FileSizeType, KeyValueObject, SizeUnit } from './types'

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
      .map((type) => type.split('/')[0])

    if (
      !starTypes.includes(file.type.split('/')[0]) &&
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
  const filename = url.split('/').pop() || ''
  const lastUnderscore = filename.lastIndexOf('_')
  const lastDot = filename.lastIndexOf('.')
  if (lastUnderscore !== -1 && lastDot !== -1 && lastUnderscore < lastDot) {
    return filename.substring(0, lastUnderscore) + filename.substring(lastDot)
  }
  return filename
}
