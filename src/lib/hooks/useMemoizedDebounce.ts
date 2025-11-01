import { useEffect, useState } from 'react'

import { isPrimitive } from '../utils/functions'

/**
 * The difference between this hook and the useDebounce hook is that this hook
 * keeps track of the values that have been debounced and only debounces new values
 *
 * NOTE: make sure to pass primitive values to this hook as non primitive
 * values are mostly always new due to react's immutability pattern
 */
export default function useMemoizedDebounce<T>(value: T, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  const [memoizedValues, setMemoizedValues] = useState<T[]>([])

  useEffect(() => {
    if (memoizedValues.includes(value)) {
      setDebouncedValue(value)
      return
    }

    const handler = setTimeout(() => {
      setDebouncedValue(value)

      const isValuePrimitive = isPrimitive(value)
      if (isValuePrimitive) {
        setMemoizedValues((p) => [...p, value])
      } else {
        console.warn(
          "useMemoizedDebounce: non primitive values are mostly always new due to react's immutability pattern, skipping memoization...",
        )
      }
    }, delay)

    return () => {
      clearTimeout(handler)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, delay])

  return debouncedValue
}
