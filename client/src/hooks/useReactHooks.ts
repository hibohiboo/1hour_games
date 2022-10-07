import { useCallback, useEffect } from 'react'
export const useKeyDown = (handler: (key: string) => void) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      handler(event.key)
    },
    [handler],
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])
}
