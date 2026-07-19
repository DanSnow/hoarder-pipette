import { useEffect, useState } from 'react'
import type { RefObject } from 'react'

/**
 * Tracks whether the referenced element has entered the viewport.
 *
 * Flips to `true` once (and stays there), then stops observing. Browsers
 * without `IntersectionObserver` are treated as always visible.
 */
export function useInView(ref: RefObject<Element | null>, options?: IntersectionObserverInit) {
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) {
      return
    }

    if (!('IntersectionObserver' in window)) {
      setIsInView(true)
      return
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setIsInView(true)
        observer.disconnect()
      }
    }, options)

    observer.observe(element)

    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- observer options are stable for this hook's usage
  }, [ref])

  return isInView
}
