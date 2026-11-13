import { useEffect, useRef, useState } from 'react'

/**
 * Detecta cuándo un elemento entra en pantalla y deja de observar.
 * Se usa para montar el showroom 3D solo cuando el usuario se acerca.
 */
export function useInView<T extends HTMLElement>(rootMargin = '500px') {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element || visible) return

    if (!('IntersectionObserver' in window)) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [rootMargin, visible])

  return { ref, visible }
}
