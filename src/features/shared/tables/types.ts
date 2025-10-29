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
