import { useCallback, useEffect } from 'react'
export const useKey = (keys: string[], handler: (key: string) => void) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      keys.forEach((key) => {
        if (event.key === key) {
          handler(key)
        }
      })
    },
    [keys, handler],
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])
}
