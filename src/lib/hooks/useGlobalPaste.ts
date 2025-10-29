import { useEffect } from 'react'

export default function useGlobalPaste(
  callBack: (e: ClipboardEvent) => void,
  ignoreFocusedElement = false,
) {
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const focusedElement = document.activeElement

      if (focusedElement && !ignoreFocusedElement) {
        if (
          focusedElement.tagName === 'INPUT' ||
          focusedElement.tagName === 'TEXTAREA' ||
          focusedElement.getAttribute('content') === 'true'
        ) {
          return
        }
      }
      callBack(e)
    }

    document.addEventListener('paste', handlePaste)
    return () => {
      document.removeEventListener('paste', handlePaste)
    }
  }, [callBack, ignoreFocusedElement])
}
