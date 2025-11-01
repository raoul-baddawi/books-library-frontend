import { DeepKeys } from '@tanstack/react-table'
import { isDate } from 'util/types'

import { formatDateWithHours } from '$/lib/utils/date.functions'
import { isKeyValObject, isPrimitive } from '$/lib/utils/functions'

import { KeyValueObject } from '../types'

export function flattenEnhancedTableSelectedDataObject(
  obj: KeyValueObject,
  parentKey = '',
): Map<string, unknown> {
  const resultMap = new Map<string, unknown>()

  for (const [key, value] of Object.entries(obj)) {
    const parsedKey = parentKey ? `${parentKey}.${key}` : key

    if (Array.isArray(value)) {
      for (const item of value) {
        if (!isDate(item) && !isPrimitive(item)) {
          throw new Error(
            `Crashed at ${parsedKey} with ${item}. Nested objects in arrays are not supported`,
          )
        }
      }

      resultMap.set(parsedKey, value.join(', '))
      continue
    }

    if (isKeyValObject(value)) {
      const flattenedValue = flattenEnhancedTableSelectedDataObject(
        value,
        parsedKey,
      )
      for (const [innerKey, val] of flattenedValue) {
        resultMap.set(innerKey, val)
      }
      continue
    }

    if (isDate(value) || isPrimitive(value)) {
      const valueToSet = isDate(value) ? formatDateWithHours(value) : value
      resultMap.set(parsedKey, valueToSet)
      continue
    }

    throw new Error(
      `Crashed at ${parsedKey} with ${value}. This data type is not supported`,
    )
  }

  return resultMap
}

export function filterEnhancedTableSelectedDataFields<
  TSelectedData extends KeyValueObject,
>(
  data: TSelectedData[],
  filterType?: 'exclude' | 'include',
  filterFields: DeepKeys<TSelectedData>[] = [],
): KeyValueObject[] {
  const result: KeyValueObject[] = []
  const flattenedData = data.map(
    (row: TSelectedData) =>
      new Map(flattenEnhancedTableSelectedDataObject(row)),
  )

  if (filterType === 'include') {
    for (const row of flattenedData) {
      const newRow: Record<string, unknown> = {}
      for (const field of filterFields) {
        const fieldString = field as string
        if (!fieldString.includes('.')) {
          const nestedFields = Array.from(row.keys()).filter((key) => {
            return key.includes(`${field}.`) || key === field
          })
          if (nestedFields?.length) {
            for (const nestedField of nestedFields) {
              if (row.has(nestedField)) {
                newRow[nestedField] = row.get(nestedField)
              }
            }
          }
        }
        if (row.has(field)) {
          newRow[field] = row.get(field)
        }
      }
      result.push(newRow)
    }

    return result
  }

  if (filterType === 'exclude') {
    for (const row of flattenedData) {
      const newRow = new Map([...row]) // Clone the original map
      for (const field of filterFields) {
        const fieldString = field as string
        if (!fieldString.includes('.')) {
          const nestedFields = Array.from(row.keys()).filter((key) => {
            return key.includes(`${field}.`) || key === field
          })
          if (nestedFields?.length) {
            for (const nestedField of nestedFields) {
              newRow.delete(nestedField)
            }
          }
        }
        newRow.delete(field)
      }
      result.push(Object.fromEntries(newRow)) // Convert Map back to plain object
    }

    return result
  }

  for (const row of flattenedData) {
    result.push(Object.fromEntries(row))
  }

  return result
}
