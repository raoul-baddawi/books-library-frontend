import { type ComponentProps, useEffect, useMemo, useState } from 'react'
import { Toaster } from 'sonner'

export default function Toast() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleSetIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleSetIsMobile()

    window.addEventListener('resize', handleSetIsMobile)
    return () => {
      window.removeEventListener('resize', handleSetIsMobile)
    }
  }, [])

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .camera-error-toast [data-sonner-toast]:has([data-toast-type="camera-error"]) {
        --toast-expanded: 1 !important;
      }
      
      .camera-error-toast [data-sonner-toast]:has([data-toast-type="camera-error"])[data-expanded="false"] {
        --toast-expanded: 1 !important;
      }
      
      /* Disable hover expansion for camera error toasts */
      .camera-error-toast [data-sonner-toast]:has([data-toast-type="camera-error"]):hover {
        --toast-expanded: 1 !important;
      }
      
      /* Force expanded state for camera error toasts */
      .camera-error-toast [data-sonner-toast]:has([data-toast-type="camera-error"]) {
        max-height: none !important;
        height: auto !important;
      }
      
      /* Additional fix for the data-expanded attribute */
      .camera-error-toast [data-sonner-toast]:has([data-toast-type="camera-error"])[data-expanded] {
        --toast-expanded: 1 !important;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  const toasterProps: ComponentProps<typeof Toaster> = useMemo(
    () => ({
      theme: 'system',
      position: isMobile ? 'top-center' : 'bottom-right',
      closeButton: !isMobile,
      richColors: true,
      invert: true,
    }),
    [isMobile],
  )

  return <Toaster {...toasterProps} className="camera-error-toast" />
}
