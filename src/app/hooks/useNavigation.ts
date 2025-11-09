import { useCallback, useEffect, useState } from "react"

interface UseNavigationProps {
  isActive: boolean
  limit: number
}

interface UseNavigationReturn {
  focusedIndex: number
}

const useNavigation = ({ isActive, limit }: UseNavigationProps): UseNavigationReturn => {
  const [focusedIndex, setFocusedIndex] = useState(0)

  const increment = useCallback(() => {
    setFocusedIndex((currentIndex) => {
      const newIndex = currentIndex + 1
      return newIndex <= limit ? newIndex : limit
    })
  }, [limit])

  const decrement = useCallback(() => {
    setFocusedIndex((currentIndex) => {
      const newIndex = currentIndex - 1
      return newIndex >= 0 ? newIndex : 0
    })
  }, [])

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
        decrement()
        break
      case 'ArrowDown':
        increment()
        break
      default:
        break
    }
  }, [increment, decrement])

  useEffect(() => {
    if (isActive) {
      window.addEventListener('keydown', onKeyDown)
      return () => {
        window.removeEventListener('keydown', onKeyDown)
      }
    }
  }, [isActive, onKeyDown])

  return { focusedIndex }
}

export default useNavigation

