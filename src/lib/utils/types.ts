export type StringWithIntellisense<
  T extends string,
  Prefix extends string = '',
  PostFix extends string = '',
> =
  | `${Prefix}${T}${PostFix}`
  | (Omit<string, T> & `${Prefix}${string}${PostFix}`)

export type KeyValueObject<KeyType extends PropertyKey = PropertyKey> = Record<
  KeyType,
  unknown
>
export const SortOrder = {
  ASC: 'asc',
  DESC: 'desc',
} as const
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]
export type Pagination = {
  offset: number
  limit: number
}

export type SizeUnit = 'kb' | 'mb' | 'gb'

export type FileSizeType = `${number}${SizeUnit}`

export type FileValidatorOptions = {
  required?: boolean
  minSize?: FileSizeType
  maxSize?: FileSizeType
  minCount?: number
  maxCount?: number
  allowedFiles?: string[]
}
